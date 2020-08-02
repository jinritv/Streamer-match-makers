var express = require('express');
var path = require('path');
var logger = require('morgan');
var debug = require('debug')('streamer-matcher:server');
var http = require('http');
var public = path.join(__dirname, 'public');

const testConnection = require('./backend/mysql');

var port = '3000'

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set('port', port);

// Home/Main quiz page
app.get('/', (req, res) => {
    res.sendFile(path.join(public, 'index.html'));
});

// Page to test the database connection
app.get('/database', (req, res) => {
    res.sendFile(path.join(public, 'database.html'));
});

// Called when the test connection button is pressed
app.post("/testMySQLConnection", (req, res, next) => {
    
   const connectionCallback = (err) => {
       let isConnected = (err == null);
       res.json({
           "Error":err,
           "Connected":isConnected
        });
    }

    testConnection(req.body, connectionCallback);
});

app.use(express.static('public'));

var server = http.createServer(app);

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);


/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
      throw error;
    }
  
    var bind = typeof port === 'string'
      ? 'Pipe ' + port
      : 'Port ' + port;
  
    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        console.error(bind + ' requires elevated privileges');
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(bind + ' is already in use');
        process.exit(1);
        break;
      default:
        throw error;
    }
  }
  
  /**
   * Event listener for HTTP server "listening" event.
   */
  
  function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
      ? 'pipe ' + addr
      : 'port ' + addr.port;
    debug('Listening on ' + bind);
  }