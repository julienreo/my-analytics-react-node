const express = require('express');
const bodyParser = require('body-parser');
const requestlogger = require('morgan');
const requestIp = require('request-ip');

const routes = require(__basedir + 'src/routes');
const error = require(__basedir + 'src/middleware/error');
const notFound = require(__basedir + 'src/middleware/not-found');

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
app.use(notFound);

// Handle errors
app.use(error);

module.exports = app;