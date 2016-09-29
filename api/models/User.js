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

      unlock: function(unlocked){
          return User.findOne(unlocked).populate('unlocked').exec(function(err,user){
              if(!user){
                  this.unlocked.add(user);
                  return this.save();
              }
              throw new CustomError("You have already unlocked "+unlocked.name);
          });
      },
      addFollower: function(follower){
          return User.findOne(follower).populate('followers').then(function(user){
              if(!user){
                  this.followers.add(user);
                  return this.save();
              }
              throw new CustomError("You have already followed "+this.name);
          });
      }
  }
};

