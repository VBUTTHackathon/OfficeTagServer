/**
 * QrCodeController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    generate: function(req,res){
        User.findOne(1).exec(function (err, user){
          if (!err) {
            var qr = {owner:user};
            QrCode.create(qr).exec(function(err, qrCode) {
                if(!err){
                    return res.json(qr);
                }else{
                    console.log(err);
                    res.status(404);
                    return res.json({error:"Could not generate QR Code."});
                }
            });
          }else{
            console.log(err);
            res.status(404);
            return res.json({error:"Could not find user."});
          }
        });
    },
    validate: function(req,res){
        var hash = req.params.hash;
        QrCode.findOne({hash:hash}).exec(function(err, qrCode) {
            if(!err && qrCode){
                var followerId = 2;
                User.findOne(followerId).exec(function(err, follower) {
                    if(!err){
                        follower.unlock(qrCode.owner);
                        QrCode.destroy(qrCode).exec(function(){
                            User.findOne(qrCode.owner).exec(function(err, owner) {
                                if(!err){
                                    owner.addFollower(followerId);
                                    return res.json({message:"User unlocked "+owner.name});
                                 }else{
                                    console.log(err);
                                    res.status(404);
                                    return res.json({error:"Could not find owner User."});
                                }
                            });
                        });
                     }else{
                        console.log(err);
                        res.status(404);
                        return res.json({error:"Could not find follower User."});
                    }
                });
            }else{
                if(err){
                    console.log(err);
                }
                res.status(404);
                return res.json({error:"Could not find QR Code."});
            }
        });
    }
};
