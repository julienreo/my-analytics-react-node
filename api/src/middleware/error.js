const log = require(__basedir + 'lib/logger');

module.exports = (err, req, res, next) => {
  log.error(err);
  res.status(err.status || 500).send(err);
};