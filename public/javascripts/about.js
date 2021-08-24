$(document).ready(function () {
  setLanguage(getDefaultLanguage());
  getDataForTheme();
});

// loads the rest of the data in JSON form (not rendered html)
function getDataForTheme() {
  $.ajax({
    beforeSend: console.log("getting rest of data"),
    url: "/getQuizData",
    type: "POST",
    data: { language: getLanguage() },
    success: (data) => {
      if (data.err) {
        console.error("Error getting data!");
      } else {
        // data is loaded so now start the page effects
        setLanguageTexts(data);
        assignThemes();
      }
    },
  });
}

function setLanguageTexts(extraData) {
  setTexts(extraData.requiredTexts);
}

function updateLanguage(language) {
  console.log("updating ", language);
  setLanguage(language);
  $.get("/setLang/" + language, function (json) {
    let nothing = "";
  });

  // first check if the desired language is already loaded (empty if not loaded)
  let loadedLang = getThisLanguageText();
  console.log(loadedLang);
  if (loadedLang == language) {
    console.log("Language already loaded.");
    return;
  }
  getDataForTheme();
}
