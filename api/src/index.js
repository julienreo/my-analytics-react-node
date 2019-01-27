const express = require('express');
const bodyParser = require('body-parser');
const requestlogger = require('morgan');
const requestIp = require('request-ip');

const routes = require(__basedir + 'src/routes');
const error = require(__basedir + 'src/middleware/error');
require(__basedir + 'lib/error-handler');

// Create Express app
const app = express();

// Handle DB connection
require(__basedir + 'db')(app);

// Parse request payload
app.use(bodyParser.json());

// Add client IP to request
app.use(requestIp.mw());

// Log request details depending on environment
if (process.env.NODE_ENV === 'development') {
  app.use(requestlogger('dev'));
}

// Handle routing
app.use('/', routes);

// Handle 404 and 500 errors
app.use([error.notFound, error.server]);

module.exports = app;