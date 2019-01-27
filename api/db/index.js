var mongoose = require('mongoose'); 

const log = require(__basedir + 'lib/logger');

module.exports = (app) => {
  // Database connection 
  mongoose.connect(
    process.env.DB_CONN, 
    { 
      useNewUrlParser: true, 
      useCreateIndex: true,
      useFindAndModify: false
    }
  );

  /* 
   * CONNECTION EVENTS
   */

  mongoose.connection.on('connected', () => {
    log.info('Mongoose connection established');
    // Make app emit `ready` event now that DB connection is established
    app.emit('ready');
    // Tell PM2 that app is ready now that DB connection is established
    process.send('ready');
  }); 

  mongoose.connection.on('error', (err) => {
    log.error('Mongoose connection error', err);
  }); 

  mongoose.connection.on('disconnected', () => {
    log.info('Mongoose connection disconnected');
  });

  // Close connection when Node process terminates 
  process.on('SIGINT', () => {  
    mongoose.connection.close(() => { 
      log.info('Mongoose connection closed as Node process ended');
      process.exit(0); 
    }); 
  }); 
};