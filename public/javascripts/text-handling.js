// what language is currently being displayed on the screen
let _CURRENT_LANGUAGE_;


var TEXTS = {};

function setTexts(text){
    TEXTS = text;
}

function getThisLanguageText(){
   if(TEXTS["this-language"]){
       return TEXTS["this-language"];
   }
   return false;
}

function setLanguage(language) {
    _CURRENT_LANGUAGE_ = language;
  }
  
  function getLanguage() {
    return _CURRENT_LANGUAGE_;
  }

// gets the default language, which we retreive from the browser
function getDefaultLanguage() {
    let lang = navigator.language;
    console.log({
      BrowserLanguage: lang,
      SupportedLanguages: navigator.languages,
    });
    return lang;
  }

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
        if(values[valueIndex]==0){
          completeText = text.replace(PLACEHOLDER, values[valueIndex]);
        } else {
    // if the value array doesn't have enough values to insert, it's replaced with an error text
    completeText = text.replace(PLACEHOLDER, MISSING_VALUE);
        }
      
      }
      // sets the updated version of the text, containing 1 less placeholder
      text = completeText;
    }
  
    return completeText;
  }
  
  // Replaces the old getTranslation() function, this one reads the
  // text from the JSON object we received from the server.
  function getText(label, params = []) {
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

  
const ERASE = "erase";
const WRITE = "write";
let textEraseAnimationTimer;
let words;
let currentWord;
let currentDirection = WRITE;
let wordListIndex = 0;
let delay = false;
let addedQuestionMark = false;

function setTextAnimation() {
  clearInterval(textEraseAnimationTimer);
  words = getText("animated-words");
  currentWord = words[wordListIndex];
  textEraseAnimationTimer = setInterval(eraseAndWriteText, 33);
}

function eraseAndWriteText() {
  // we wait a bit before erasing
  if (delay) {
    return;
  }

  if (addedQuestionMark) {
    keyword.innerHTML = currentWord;
    addedQuestionMark = false;
    return;
  }

  // get text thats displayed right now
  var remainingText = keyword.innerHTML;
  // get the length of it
  var l = remainingText.length;
  // if theres some characters in it
  if (currentDirection == "erase") {
    if (l > 0) {
      // then erase 1 character
      keyword.innerHTML = remainingText.substring(0, l - 1);
    } else {
      currentDirection = "write";
      wordListIndex += 1;
      // no characters, change to next word
      if (wordListIndex == words.length) {
        wordListIndex = 0;
      }
      // get a new word to animate
      currentWord = words[wordListIndex];
    }
  } else {
    // if we have not written the whole word yet
    if (l < currentWord.length) {
      // write 1 character
      keyword.innerHTML += currentWord.charAt(l);
    } else {
      // done writing the word, so add black question mark and delay a bit
      // the mockup UI has the question mark as black, so we must also
      // remove the question mark from the localization files.
      keyword.innerHTML += `<span class="dark-text">?</span>`;
      addedQuestionMark = true;
      delay = true;
      setTimeout(() => {
        delay = false;
        currentDirection = "erase";
      }, 800);
    }
  }
}

// returns an error message and outputs and error to the console.
function sadKEK(label, message) {
    console.error(`${getLanguage()} language error for '${label}': ${message}`);
    return `<span style="color:red">${message} <img src="https://cdn.betterttv.net/emote/5d72ae0aa32edb714a9df060/1x"/></span>`;
  }