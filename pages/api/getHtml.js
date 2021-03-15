const {
  LoadLanguageJSON,
  getText,
} = require('../../backend/localizations/localization')

export default function handler(req, res) {
  let LANGUAGE_TO_GET = req.body.language
  console.log(`rendering html for ${LANGUAGE_TO_GET}`)
  const onLangLoaded = (result, error) => {
    res.render('./full_page', {
      // quiz questions we need to render the quiz html
      Quiz,
      // our function to get texts (pre-loaded with our language's text)
      getText: getText(result.Texts),
      // languages available
      Languages: result.Languages,
      // the language we use
      ThisLang: LANGUAGE_TO_GET,
    })
  }
  LoadLanguageJSON(LANGUAGE_TO_GET, onLangLoaded)
}
