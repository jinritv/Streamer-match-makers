const fs = require("fs");

const Languages = {
  Tags: {
    ENGLISH: "en-US",
    GERMAN: "de-DE",
    FRENCH: "fr-FR",
    KOREAN: "kr-KR",
    SPANISH: "sp-SP",
    // add a new language here
  },
  Icons: {
    "en-US": "https://cdn.betterttv.net/emote/566ca04265dbbdab32ec054a/1x",
    "de-DE": "",
    "fr-FR": "",
    "kr-KR": "",
    "sp-SP": "",
    // add a new language here
  },
  Names: {
    "en-US":"English",
    "de-DE":"Deutsche",
    "fr-FR":"Français",
    "kr-KR":"한국어",
    "sp-SP":"Español",
  }
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
      Languages,
      Texts: languageData,
      Error: errorMessage,
    },
    null
  );
};

// Inserts values from an array into a string
// use [*] to mark a place in text where a value should be inserted.
// example text: "Between [*] and [*] average viewers",
// the two placeholders will be replaced in order,
// from the values in the values array.
function insertValuesIntoText(text, values) {
  let completeText = "";
  const PLACEHOLDER = "[*]";
  const MISSING_VALUE = "[missing]";
  let valuesToInsert = 0;
  for (let index = 0; index < text.length; index++) {
    // we are looking for substrings that are formatted lke this: [*]
    let str = text.substring(index, index + 3);
    if (str == PLACEHOLDER) {
      // keeping track of how many placeholders we find in the text
      valuesToInsert += 1;
    }
  }
  // for each placeholder we replace it with a value from the array
  for (let valueIndex = 0; valueIndex < valuesToInsert; valueIndex++) {
    if (values[valueIndex]) {
      completeText = text.replace(PLACEHOLDER, values[valueIndex]);
    } else {
      // if the value array doesn't have enough values to insert, it's replaced with an error text
      completeText = text.replace(PLACEHOLDER, MISSING_VALUE);
    }
    // sets the updated version of the text, containing 1 less placeholder
    text = completeText;
  }

  return completeText;
}

// Replaces the old getTranslation() function, this one reads the
// text from the JSON object we received from the server.
const getText = (TEXTS) => (label, params = []) => {
  // check if there is translation for this label, then use it
  if (TEXTS[label]) {
    // if there are params to insert
    if (params.length > 0) {
      // insert the values into the string
      return insertValuesIntoText(TEXTS[label], params);
    }
    //else just return the entire text
    return TEXTS[label];
  }
  return sadKEK(label, "missing label");
}

// returns an error message and outputs and error to the console.
function sadKEK(label, message) {
  console.error(`language error for '${label}': ${message}`);
  return `*${message}*`;
}

module.exports = {LoadLanguageJSON, getText};
