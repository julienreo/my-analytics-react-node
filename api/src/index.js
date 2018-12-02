const express = require('express');
const createError = require('http-errors');
const bodyParser = require('body-parser');
const requestlogger = require('morgan');
const requestIp = require('request-ip');

const log = require(__basedir + 'lib/logger');
const routes = require(__basedir + 'src/routes');

// Create Express app
const app = express();

// Handle DB connection
require(__basedir + 'db')(app);

/* 
 * Bind middleware to app
 */

// Parse request payload and make data available on request object
app.use(bodyParser.json());

// Populate request object with client IP
app.use(requestIp.mw());

// Log request details depending on environment
if (process.env.NODE_ENV === 'development') {
  app.use(requestlogger('dev'));
}

// Handle routing
app.use('/', routes);

// Catch 404 errors
app.use((req, res, next) => {
  next(createError(404));
});

// Handle errors
app.use((err, req, res, next) => {
  log.error(err);
  res.status(err.status || 500);
  res.send(err);
});

module.exports = app;