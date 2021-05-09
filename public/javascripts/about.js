$(document).ready(function () {
  setLanguage(getDefaultLanguage());
  assignThemes();
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
      }
    },
  });
}

function setLanguageTexts(extraData) {
  setTexts(extraData.requiredTexts);
}
