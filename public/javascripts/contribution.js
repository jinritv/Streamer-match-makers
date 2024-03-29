const carouselSlideList = [
  {
    title: "Data Analyst",
    subtitle: "Streamer data collector",
    desc: "If you wanna be a slave, join JinriCo NOW",
  },
  {
    title: "Frontend Developer",
    subtitle: "HTML / Javascript / CSS",
    desc: "If you wanna be a slave, join JinriCo NOW",
  },
  {
    title: "Backend Developer",
    subtitle: "Node.js / Express.js / EJS / PostgreSQL",
    desc: "If you wanna be a slave, join JinriCo NOW",
  },
];

$(document).ready(function () {
  setCarouselSlide(0);
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
  window.location.reload();
}

$("#carouselIndicators").on("slide.bs.carousel", function (event) {
  setCarouselSlide(event.to);
  setCarouselIndicator(event, event.to);
});

function setCarouselSlide(slideNum) {
  $("#carousel-slide-title").text(carouselSlideList[slideNum].title);
  $("#carousel-slide-subtitle").text(carouselSlideList[slideNum].subtitle);
  $("#carousel-slide-desc").text(carouselSlideList[slideNum].desc);
}

function setCarouselIndicator(event, slideNum) {
  const current = $(event.target).find(".active");
  const index = slideNum + 1;
  $(".carousel-indicators li").removeClass("active");
  $(".carousel-indicators li:nth-child(" + index + ")").addClass("active");
}
