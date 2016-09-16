/**
 * QrCodeController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    generate: function(req,res){
        var value = "aef123456";
        User.findOne({id:1}).exec(function (err, user){
          if (!err) {
            console.log(user);
            var qr = {value:value,owner:user};
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
    }
};

