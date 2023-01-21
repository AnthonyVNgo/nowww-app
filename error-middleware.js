const ClientError = require('./client-error');
const {JsonWebTokenError } = require('jsonwebtoken')

function errorMiddleware(err, req, res, next) {
  if (err.status === 404) {
    res.status(404).sendFile(path.join(__dirname, "client/build/index.html")).send('Page could not be found, redirected home');
  }
  else if (err instanceof ClientError) {
    res.status(err.status).json({
      error: err.message
    });
  } else if (err instanceof JsonWebTokenError) {
    res.status(401).json({
      error: 'invalid access token'
    });
  } else {
    console.error(err);
    res.status(500).json({
      error: 'an unexpected error occurred'
    });
  }
}

module.exports = errorMiddleware;