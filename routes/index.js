var express = require("express");
var router = express.Router();

const calculateStreamer = require("../backend/calculate_streamer");
const createStreamer = require("../backend/create_streamer");
const LoadLanguageJSON = require("../backend/localizations/localization");

// Home/Main quiz page
router.get("/", (req, res) => {
  res.render("new_index");
});

// Called at the end of the quiz
router.post("/calculateStreamer", (req, res, next) => {
  const quizResultsCallback = (results, err) => {
    res.json({
      Error: err,
      Results: results,
    });
  };

  calculateStreamer(req.body, quizResultsCallback);
});

// Called when a new streamer is added
router.post("/createNewStreamer", (req, res, next) => {
  console.log(req.body);

  const createStreamerCallback = (results, err) => {
    res.json({
      Error: err,
      Results: results,
    });
  };

  createStreamer(req.body.newStreamer, createStreamerCallback);
});

// We are requesting JSON of all the site text in the language requested
// The translation JSON files are stored in the /backend/localizations/translations folder.
router.post("/getLocalization", (req, res, next) => {
  let LANGUAGE_TO_GET = req.body.language;

  const getLanguageJSONCallback = (results, err) => {
    res.json({
      Error: err,
      Results: results,
    });
  };

  LoadLanguageJSON(LANGUAGE_TO_GET, getLanguageJSONCallback);
});

// Not-found page
router.get("/404", (req, res) => {
  res.status(404).render("not_found");
});

router.get("*", (req, res) => {
  res.redirect("/404");
});

module.exports = router;
