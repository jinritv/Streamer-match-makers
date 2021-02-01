var express = require("express");
var router = express.Router();

const calculateStreamer = require("../backend/calculate_streamer");
const createStreamer = require("../backend/create_streamer");
const {LoadLanguageJSON, getText} = require("../backend/localizations/localization");

const {Quiz} = require("../backend/quiz_questions");

// Home/Main quiz page
router.get("/", (req, res) => {
  res.render("index");
});

// renders the html for the quiz and most of the page
router.post('/getHtml', function(req, res){
  let LANGUAGE_TO_GET = req.body.language;
  console.log(`rendering html for ${LANGUAGE_TO_GET}`);
  const onLangLoaded = (result, error)=>{ 
    res.render("./full_page", {
      // quiz questions we need to render the quiz html
      Quiz,
      // our function to get texts (pre-loaded with our language's text)
      getText: getText(result.Texts),
      // languages available
      Languages:result.Languages,
      // the language we use
      ThisLang: LANGUAGE_TO_GET,
    });
  }
  LoadLanguageJSON(LANGUAGE_TO_GET, onLangLoaded)
});

// renders the html for the quiz and most of the page
router.post('/getQuizData', function(req, res){
  let LANGUAGE_TO_GET = req.body.language;
  console.log(`getting rest of data for ${LANGUAGE_TO_GET}`);
  const onLangLoaded = (result, error)=>{
    let requiredTexts = {
      'animated-words': result.Texts['animated-words'],
      'dark-mode-label': result.Texts['dark-mode-label'],
      'light-mode-label': result.Texts['light-mode-label'],
      'generated-quiz-modal-progress-label': result.Texts['generated-quiz-modal-progress-label'],
      'range-display-average_viewers': result.Texts['range-display-average_viewers'],
      'results': result.Texts['results'],
      'this-language':result.Texts['this-language']
    } 
    res.send({
      Quiz,
      requiredTexts
    });
  }

  LoadLanguageJSON(LANGUAGE_TO_GET, onLangLoaded)
})

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
