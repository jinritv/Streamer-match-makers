const fs = require("fs");

const Languages = {
  Tags: {
    ENGLISH: "en-US",
    GERMAN: "de-DE",
    FRENCH: "fr-FR",
    // add a new language here
  },
  Icons: {
    "en-US": "https://cdn.betterttv.net/emote/566ca04265dbbdab32ec054a/1x",
    "de-DE": "",
    "fr-FR": "",
    // add a new language here
  },
};

// Sets the filepath for the JSON language file, and loads it
const LoadLanguageJSON = (language, callback) => {
  console.log("Loading JSON language file for:", language);
  //Check if user-language is available
  if (Object.values(Languages.Tags).includes(language)) {
    // Define the filepath to our file
    let filePath = `backend/localizations/translations/${language}.json`;
    // Attempt to read the file for that language
    fs.readFile(filePath, CallbackLanguageFileLoad(callback));
  } else {
    //Define Filepath to constant language (If we didnt add that Language, use English instead)
    let filePath = `backend/localizations/translations/en-US.json`;
    //Attempt to read the file for that language
    fs.readFile(filePath, CallbackLanguageFileLoad(callback));
  }
};

// Check if there was an error with loading (maybe the file doesn't exist?)
const CallbackLanguageFileLoad = (callbackFileLoaded) => (err, rawdata) => {
  let errorMessage;
  // this holds our JSON text we want to return back to the client
  let languageData;
  // check if error opening the file (maybe it doesn't exist or the wrong name?)
  if (err) {
    errorMessage =
      "Error: could not load language .json file! Check if the filepath and names are correct. Default language set to English";
    console.error(errorMessage);
    // if error, just return the english file
    // make sure the en-US.json is always available
    rawdata = fs.readFileSync(`backend/localizations/translations/en-US.json`);
  }
  languageData = JSON.parse(rawdata);
  // add the Icons and AvailableLanguages to our data that we send back to the client, and any error message
  callbackFileLoaded(
    {
      AvailableLanguages: Languages.Tags,
      Texts: languageData,
      Icons: Languages.Icons,
      Error: errorMessage,
    },
    null
  );
};

module.exports = LoadLanguageJSON;
