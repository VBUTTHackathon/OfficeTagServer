/**
 * QrCodeController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    generate: function (req, res) {
        User.findOne(1).then(function (user) {
            if (user) {
                return {
                    owner: user.id
                };
            }
            throw new Error("Could not find session user.");
        }).then(function (newQrCode) {
            return QrCode.create(newQrCode).then(function (qrCode) {
                if (qrCode) {
                    return qrCode;
                }
                throw new Error("Could not generate QR Code.");
            });
        }).then(function (qrCode) {
            return res.json(qrCode);
        }).catch(function (e) {
            console.log(e);
            res.status(404);
            return res.json({error: e.message});
        });
    },

    validate: function (req, res) {
        var hash = req.params.hash;
        QrCode.findOne({
            hash: hash
        }).exec(function (err, qrCode) {
            if (!err && qrCode) {
                var followerId = 2;
                User.findOne(followerId).exec(function (err, follower) {
                    if (!err) {
                        follower.unlock(qrCode.owner);
                        QrCode.destroy(qrCode).exec(function () {
                            User.findOne(qrCode.owner).exec(function (err, owner) {
                                if (!err) {
                                    owner.addFollower(followerId);
                                    return res.json({
                                        message: "User unlocked " + owner.name
                                    });
                                } else {
                                    console.log(err);
                                    res.status(404);
                                    return res.json({
                                        error: "Could not find owner User."
                                    });
                                }
                            });
                        });
                    } else {
                        console.log(err);
                        res.status(404);
                        return res.json({
                            error: "Could not find follower User."
                        });
                    }
                });
            } else {
                if (err) {
                    console.log(err);
                }
                res.status(404);
                return res.json({
                    error: "Could not find QR Code."
                });
            }
        });
    }
};
