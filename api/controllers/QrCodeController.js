/**
 * QrCodeController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    generate: function(req,res){
        var value = "aef123456";
        QrCode.create({value:value,ownerId:"wassim"});
        QrCode.findOne({value:value}).then(function(qr) {
            res.json(qr.toJSON());
        });
    }
};

