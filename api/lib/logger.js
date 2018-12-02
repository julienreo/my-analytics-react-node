// Create a rolling file logger based on date/time
const logger = require('simple-node-logger').createRollingFileLogger({
  logDirectory: __basedir + '../storage/logs',
  fileNamePattern:'api-roll-<DATE>.log',
  dateFormat:'YYYY.MM.DD'
});

logger.setLevel('info');

module.exports = logger;