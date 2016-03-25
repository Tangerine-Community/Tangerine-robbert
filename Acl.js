'use strict';

var nano = require('nano')('http://admin:password@localhost:5984');
var db = nano.db.use('tangerine');

module.exports = function(permission, user, context, callback) {

  // Tunnel down until we find the context, then climb up until we find the username at a level 
  // equal or higher than the permission. 

  // Just kiddin' ;) - We'll do that in the future maybe. But for now we have a flat list of 
  // groups with simple access control lists. Not that unsimilar to role-based access control.

  db.get('acl', function(err, body) {
    body.groups.forEach(function(group) {
      if(group.users.indexOf(user) !== -1 && group.permissions.indexOf(permission) !== -1) {
        return callback(null, true)
      }
      else {
        callback(null, false)
      }
    })
  })

}

