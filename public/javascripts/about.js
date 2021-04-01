$(() => {
    // Set default language
    setLanguage(getDefaultLanguage());
});

function updateLanguage(language) {
    console.log("updating ", language);
    setLanguage(language);
    $.get('/setLang/' + language, null);
    // first check if the desired language is already loaded (empty if not loaded)
    let loadedLang = getThisLanguageText();
    console.log(loadedLang)
    if (loadedLang == language) {
        console.log("Language already loaded.");
        return;
    }
}