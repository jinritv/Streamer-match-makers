// The theme, either 'light' or 'dark'
const THEMES = {
    Dark: "dark-mode",
    Light: "light-mode",
  };
  var CurrentTheme = $("body").hasClass(THEMES.Light) ? THEMES.Light : THEMES.Dark;

  // change the class of the wrapper to change the theme colors
var $ThemeWrapper, $themeLabel, $themeIcon;


function assignThemes() {
    $ThemeWrapper = $("#full-page");
    $themeIcon = $("#theme-icon");
    $themeLabel = $("#theme-label");
  }

// Toggles the theme to dark/light mode
function toggleDarkMode() {
    // remove current theme
    $ThemeWrapper.removeClass(CurrentTheme);
    // get opposite of current theme for the next theme
    let nextTheme = CurrentTheme == THEMES.Dark ? THEMES.Light : THEMES.Dark;
    $ThemeWrapper.addClass(nextTheme);
    $themeIcon.text(nextTheme == THEMES.Dark ? "🌞" : "🌚");
    $themeLabel.text(getText(`${CurrentTheme}-label`));
    CurrentTheme = nextTheme;
    $.get('/setTheme/' + CurrentTheme, function (json) {
		let nothing = "";
    });
  }
