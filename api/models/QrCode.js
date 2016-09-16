/**
 * QrCode.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    hash: {
      type: 'string',
        defaultsTo: ''
    },
    owner: { model: 'User', required: true }
  },

   generateHash: function () {
        var crypto = require('crypto')
        , shasum = crypto.createHash('sha1');
          var rnd = crypto.randomBytes(16);
          shasum.update(rnd);
          return shasum.digest('hex');
    },
     beforeCreate: function (qrCode, cb) {
          qrCode.hash = this.generateHash();
        return cb(null, qrCode);
    }        
};
