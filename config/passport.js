module.exports.passport = {
  ldap: {
    strategy: require('passport-ldapauth').Strategy,
    options: {
      server: {
        url: 'ldap://localhost:1389',
        searchBase: 'dc=example,dc=org',
        searchFilter: '(uid={{username}})'
      }
    }
  }
}
