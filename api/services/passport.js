var passport = require('passport');
var LdapStrategy = require('passport-ldapauth').Strategy;

passport.serializeUser(function (user, next) {
  next(null, user.id);
});

passport.deserializeUser(function (id, next) {
  User.findOne(id, next);
});

passport.loadStrategies = function () {
  var self       = this
    , strategies = sails.config.passport;

  Object.keys(strategies).forEach(function (key) {
    var options = { passReqToCallback: true }, Strategy;

    if (key === 'local') {
      // Since we need to allow users to login using both usernames as well as
      // emails, we'll set the username field to something more generic.
      _.extend(options, { usernameField: 'identifier' });

      //Let users override the username and passwordField from the options
      _.extend(options, strategies[key].options || {});

      // Only load the local strategy if it's enabled in the config
      if (strategies.local) {
        Strategy = strategies[key].strategy;

        self.use(new Strategy(options, self.protocols.local.login));
      }
    } else if (key === 'bearer') {

      if (strategies.bearer) {
        Strategy = strategies[key].strategy;
        self.use(new Strategy(self.protocols.bearer.authorize));
      }

    } else if (key === 'ldap') {
      if (strategies.ldap) {
        Strategy = strategies[key].strategy;
        self.use(new Strategy(strategies.ldap.options));
      }
    } else {
      var protocol = strategies[key].protocol
        , callback = strategies[key].callback;

      if (!callback) {
        callback = 'auth/' + key + '/callback';
      }

      Strategy = strategies[key].strategy;

      var baseUrl = sails.getBaseurl();

      switch (protocol) {
        case 'oauth':
        case 'oauth2':
          options.callbackURL = url.resolve(baseUrl, callback);
          break;

        case 'openid':
          options.returnURL = url.resolve(baseUrl, callback);
          options.realm     = baseUrl;
          options.profile   = true;
          break;
      }

      // Merge the default options with any options defined in the config. All
      // defaults can be overriden, but I don't see a reason why you'd want to
      // do that.
      _.extend(options, strategies[key].options);

      self.use(new Strategy(options, self.protocols[protocol]));
    }
  });
};

module.exports = passport;
