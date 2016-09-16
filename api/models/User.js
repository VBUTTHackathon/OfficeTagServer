/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
      //pending: {collection: 'User'},
      unlocked: {collection: 'User'},
      //followers: {collection: 'User'},

      unlock: function(userId){
          this.unlocked.add(userId);
          this.save();
      }
  }
};

