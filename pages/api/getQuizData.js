const { LoadLanguageJSON } = require('../../backend/localizations/localization')
const { Quiz } = require('../../backend/quiz_questions')

export default function handler(req, res) {
  let LANGUAGE_TO_GET = req.body.language
  console.log(`getting rest of data for ${LANGUAGE_TO_GET}`)
  const onLangLoaded = (result, error) => {
    let requiredTexts = {
      'animated-words': result.Texts['animated-words'],
      'dark-mode-label': result.Texts['dark-mode-label'],
      'light-mode-label': result.Texts['light-mode-label'],
      'generated-quiz-modal-progress-label':
        result.Texts['generated-quiz-modal-progress-label'],
      'range-display-average_viewers':
        result.Texts['range-display-average_viewers'],
      results: result.Texts['results'],
      'this-language': result.Texts['this-language'],
    }
    res.send({
      Quiz,
      requiredTexts,
    })
  }

  LoadLanguageJSON(LANGUAGE_TO_GET, onLangLoaded)
}
