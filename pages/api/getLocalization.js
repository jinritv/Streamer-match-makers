const { LoadLanguageJSON } = require('../../backend/localizations/localization')

export default function handler(req, res) {
  let LANGUAGE_TO_GET = req.body.language

  const getLanguageJSONCallback = (results, err) => {
    res.json({
      Error: err,
      Results: results,
    })
  }

  LoadLanguageJSON(LANGUAGE_TO_GET, getLanguageJSONCallback)
}
