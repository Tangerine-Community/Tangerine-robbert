'use strict';

const Group = require('../../Group');
const User = require('../../User');

const logger = require('../../logger');
const HttpStatus = require('http-status-codes');

const errorHandler = require('../../utils/errorHandler');

/** Creates a new group.
 * Makes new database, and uploader user.
 * replicates from trunk
 * alters settings doc
 */
function newGroup(req, res) {

  logger.info(`New group: ${JSON.stringify(req.body)}`);

  const notEvenLoggedIn = req.couchAuth.body.userCtx.name === null;
  if (notEvenLoggedIn) {
    logger.warn('Group creation failed: User not logged in');
    return res.status(HttpStatus.UNAUTHORIZED)
      .json({
        message : 'Please log in'
      });
  }

  const groupName = req.body.name;
  const nameFromCookie = req.couchAuth.body.userCtx.name;

  const requestingUser = new User({
    name : nameFromCookie
  });
  const group = new Group({
    name : groupName
  });

  logger.info(`New group '${group.name()}' request by '${requestingUser.name()}'`)

  group.create()
    .then(function addAdmin() {
      return requestingUser.grantAdmin(group);
    })
    .then(function respondOk() {
      const message = `New group '${groupName}' created`;
      logger.info(message)
      res
        .status(HttpStatus.CREATED)
        .json({
          message : message
        });
    })
    .catch(errorHandler(res));
}

module.exports = newGroup;