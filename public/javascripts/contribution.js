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
});

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
  var current = $(event.target).find(".active");
  var index = $(current).index();
  if (index + 2 > $(".carousel-indicators li").length) {
    index = -1;
  }
  $(".carousel-indicators li").removeClass("active");
  $(".carousel-indicators li:nth-child(" + (index + 2) + ")").addClass(
    "active"
  );
}
