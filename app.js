var express = require("express");
var path = require("path");
var logger = require("morgan");

var indexRouter = require("./routes/index");

var app = express();

// app config
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// routes
app.use("/", indexRouter);

module.exports = app;
