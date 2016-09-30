/**
 * AuthController
 *
 * @description :: Server-side logic for managing auths
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var passport = require('passport');

module.exports = {

  _config: {
    actions: false,
    shortcuts: false,
    rest: false
  },

  login: function (req, res, next) {

    passport.authenticate('ldapauth', function (err, ldapUser, info) {
      if (err) {
        return next(err);
      }
      if (!ldapUser) {
        req.flash('error', info.message);
        return res.redirect('/login');
      }
      User.findOne({username:ldapUser.uid})
        .then(function(user){
          if(!user){
            return User.create({
              username:ldapUser.uid,
              firstName:ldapUser.givenName,
              lastName:ldapUser.sn
            });
          }
      }).then(function(user){
        req.logIn(user, (err) => {
              if (err) {return next(err);}
              req.flash('success', {
                msg: 'Success! You are logged in.'
              });
              res.redirect(req.session.returnTo || '/');
            });
      })
    })(req, res, next);
  },

  logout: function (req, res) {
    req.logout();
    res.redirect('/');
  }
};
