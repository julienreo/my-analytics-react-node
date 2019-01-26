const createError = require('http-errors');
const log = require(__basedir + 'lib/logger');

exports.notFound = (req, res, next) => {
  next(createError(404));
};

exports.server = (err, req, res, next) => {
  log.error(err);
  res.status(err.status || 500).send(err);
};