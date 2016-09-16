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
      followers: {collection: 'User'},

      unlock: function(user){
          User.findOne(user).populate('unlocked').exec(function(err,unlocked){
              if(!unlocked){
                  this.unlocked.add(user);
                  this.save();
              }
          });
      },
      addFollower: function(follower){
          User.findOne(follower).populate('followers').exec(function(err,follower){
              if(!follower){
                  this.unlocked.add(user);
                  this.save();
              }
          });
      }
  }
};

