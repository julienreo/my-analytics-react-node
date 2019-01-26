const log = require(__basedir + 'lib/logger');

// Log unhandled exceptions thrown outside Express context
process.on('uncaughtException', (e) => {
  log.error(e);
  process.exit(1);
});

// Log unhandled promise rejections thrown outside Express context
process.on('unhandledRejection', (e) => {
  throw e; // Will through an uncaught exception
});