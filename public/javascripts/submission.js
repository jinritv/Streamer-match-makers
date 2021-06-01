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

function submitFormEvent(e) {
  e.preventDefault();

  fetch("/submission", {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      submitterName: e.target.submitterName.value,
      submitterTwitchUsername: e.target.submitterTwitchUsername.value,
      isFollower: e.target.isFollower.value,
      streamerName: e.target.streamerName.value,
      streamerTwitchUsername: e.target.streamerTwitchUsername.value,
      message: e.target.message.value,
    }),
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      resetForm();
      alert("Submission successful!");
    })
    .catch((err) => {
      alert("Submission failed!");
    });
}

function resetForm() {
  $('input[name="submitterName"]').val("");
  $('input[name="submitterTwitchUsername"]').val("");
  $('input:radio[name="isFollower"]')
    .filter("[value=yes]")
    .prop("checked", true);
  $('input[name="streamerName"]').val("");
  $('input[name="streamerTwitchUsername"]').val("");
  $('textarea[name="message"]').val("");
}
