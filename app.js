var express = require("express");
var path = require("path");
var logger = require("morgan");
var session = require("express-session");

var indexRouter = require("./routes/index");
var aboutRouter = require("./routes/about");

var app = express();

// app config
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(session({secret: 'jin.ri.tv'}));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// routes
app.use("/about", aboutRouter);
app.use("/", indexRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error("Not found");
  err.status(404);
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
