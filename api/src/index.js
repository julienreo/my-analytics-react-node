const express = require('express');

// Create Express app
const app = express();

// Handle DB connection
require(__basedir + 'db')(app);

// Load middleware
require(__basedir + 'src/middleware')(app);

module.exports = app;