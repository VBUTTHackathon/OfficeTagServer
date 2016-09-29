/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {
        //pending: {collection: 'User'},
        unlocked: {
            collection: 'User'
        },
        followers: {
            collection: 'User'
        },

        unlock: function (toUnlock) {
            if(toUnlock.id === this.id){
                throw new CustomError("You can't tag yourself.");
            }
            return User.findOne(this.id)
                .populate('unlocked', {where: {id: toUnlock.id}})
                .then(function (user) {
                    if (user && user.unlocked.length === 0) {
                        user.unlocked.add(toUnlock);
                         return user.save().then(function(){
                            return user;
                        });
                    }
                    throw new CustomError("You have already unlocked " + toUnlock.name,user);
                });
        },
        addFollower: function (follower) {
            if(follower.id === this.id){
                throw new CustomError("You can't tag yourself.");
            }
            return User.findOne(this.id)
                .populate('followers', {where: {id: follower.id}})
                .then(function (user) {
                    if (user && user.followers.length === 0) {
                        user.followers.add(follower);
                        return user.save().then(function(){
                            return user;
                        });
                    }
                    throw new CustomError("You have already followed " + this.name);
                });
        }
    }
};
