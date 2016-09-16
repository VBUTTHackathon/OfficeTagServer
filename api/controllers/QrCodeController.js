/**
 * QrCodeController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    generate: function(req,res){
        var value = "aef123456";
        User.findOne(1).exec(function (err, user){
          if (!err) {
            var qr = {hash:value,owner:user.id};
            QrCode.create(qr).exec(function(err, qrCode) {
                if(!err){
                    return res.json(qr);
                }else{
                    console.log(err);
                    res.status(404);
                    return res.json({error:"Could not find user."});
                }
            });
          }else{
            console.log(err);
            res.status(404);
            return res.json({error:"Could not generate QR Code."});
          }
        });
    },
    validate: function(req,res){
        var hash = req.params.hash;
        QrCode.findOne({hash:hash}).exec(function(err, qrCode) {
            if(!err){
                var followerId = 2;
                User.findOne(followerId).exec(function(err, follower) {
                    if(!err){
                        follower.unlock(qrCode.owner);
                        return res.json({message:"User unlocked "+qrCode.owner});
                     }else{
                        console.log(err);
                        res.status(404);
                        return res.json({error:"Could not find owner User."});
                    }
                });
            }else{
                console.log(err);
                res.status(404);
                return res.json({error:"Could not find QR Code."});
            }
        });
    }
};

