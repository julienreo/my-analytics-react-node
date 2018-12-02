// Define app base directory
global.__basedir = __dirname + '/'; 

const log = require(__basedir + 'lib/logger');
const app = require(__basedir + 'src');

// Start server when app fires `ready` event (meaning that DB connection is established)
app.on('ready', () => {
  const listener = app.listen(process.env.PORT, () => {
    log.info('Listening on port ' + listener.address().port);
  });
});