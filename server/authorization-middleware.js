const jwt = require('jsonwebtoken')
const ClientError = require('./client-error')

const authorizationMiddleware = (req, res, next) => {
  const token = req.get('x-access-token');
  if(!token) {
    throw new ClientError(401, 'authentication required')
  }
  const payload = jwt.verify(token, process.env.TOKEN_SECRET)
  req.user = payload
  next();
};

module.exports = authorizationMiddleware
