var express = require('express');
var path = require('path');
var logger = require('morgan');
var debug = require('debug')('streamer-matcher:server');
var http = require('http');

const calculateStreamer = require('./backend/calculate_streamer');
const createStreamer = require('./backend/create_streamer');
const LoadLanguageJSON = require('./backend/localizations/localization');

var app = express();

// app config
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Home/Main quiz page
app.get('/', (req, res) => {
    res.render('new_index');
});

// Called at the end of the quiz
app.post("/calculateStreamer", (req, res, next) => {
    
  const quizResultsCallback = (results, err) => {
      res.json({
          "Error": err,
          "Results":results
       });
   };

   calculateStreamer(req.body, quizResultsCallback);
});

// Called when a new streamer is added 
app.post("/createNewStreamer", (req, res, next) => {

  console.log(req.body);
    
  const createStreamerCallback = (results, err) => {
      res.json({
          "Error": err,
          "Results":results
       });
   };

   createStreamer(req.body.newStreamer, createStreamerCallback);
});

// We are requesting JSON of all the site text in the language requested
// The translation JSON files are stored in the /backend/localizations/translations folder.
app.post("/getLocalization", (req, res, next)=>{

  let LANGUAGE_TO_GET = req.body.language;

  const getLanguageJSONCallback = (results, err) => {
    res.json({
      "Error":err,
      "Results": results
    });
  };

  LoadLanguageJSON(LANGUAGE_TO_GET, getLanguageJSONCallback);
});

// Not-found page
app.get("/404", (req, res) => {
    res.status(404);
    res.render('not_found');
});

app.get("*", (req, res) => {
    res.redirect("/404");
});

/**
 * Get port from environment and store in Express.
 */

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

var port = (process.env.PORT || 3000)
app.set('port', port);

/**
 * Create HTTP server and listen on provided port, on all network interfaces.
 */

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
