/**
 * QrCodeController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

function createQrCode(user) {
    var newQrCode = {
        owner: user.id
    };
    return QrCode.create(newQrCode)
        .then(function (qrCode) {
            if (!qrCode) {
                throw new CustomError("Could not generate QR Code.");
            }
            return qrCode;
        });
}

function getCurrentUser() {
    return User.findOne(1)
        .then(function (user) {
            if (!user) {
                throw new CustomError("Could not find session user.");
            }
            return user;
        });
}

function getQrCode(hash) {
    return QrCode.findOne({
        hash: hash
    }).populate('owner').then(function (qrCode) {
        if (!qrCode) {
            throw new CustomError("Could not find QR Code.");
        }
        if (!qrCode.owner) {
             throw new CustomError("Could not find QR Code owner.");
        }
        return qrCode;
    });
}

function deleteQrCode(qrCode) {
    return QrCode.destroy(qrCode)
        .then(function (qrCode) {
            if (!qrCode) {
                throw new CustomError("Could not delete QR Code.");
            }
            return qrCode;
        });
}

module.exports = {
    generate: function (req, res) {
        return getCurrentUser()
            .then(createQrCode)
            .then(function (qrCode) {
                return res.json(qrCode);
            }).catch(CustomError, function (e) {
                console.log(e);
                return res.json(404, {
                    error: e.message
                });
            }).catch(function (e) {
                console.log(e);
                return res.send(500);
            });
    },

    validate: function (req, res) {
        return getQrCode(req.params.hash)
            .then(deleteQrCode)
            .then(function(qrCode){
                var owner = qrCode.owner;
                return getCurrentUser().then(function(user){
                    return user.unlock(owner);
                }).then(function(user){
                    return owner.addFollower(user);
                });
            }).then(function (owner) {
                return res.json({
                    message: "User unlocked " + owner.name
                });
            }).catch(CustomError, function (e) {
                console.log(e);
                return res.json(404, {
                    error: e.message
                });
            }).catch(function (e) {
                console.log(e);
                return res.send(500);
            });
    }
};
