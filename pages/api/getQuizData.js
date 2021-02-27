const fs = require('fs/promises')
const path = require('path')
const { Quiz } = require('../../backend/quiz_questions')

export default async function handler(req, res) {
  const { language } = JSON.parse(req.body)

  const translationsDirectory = path.join(
    process.cwd(),
    'backend/localizations/translations'
  )
  const filenames = await fs.readdir(translationsDirectory)

  const translationFiles = filenames.map(async (filename) => {
    const filePath = path.join(translationsDirectory, filename)
    const fileContents = await fs.readFile(filePath, 'utf8')

    return {
      filename,
      content: fileContents,
    }
  })

  const translations = await Promise.all(translationFiles)

  const translation = JSON.parse(
    translations.find((file) => {
      return file.filename === `${language}.json`
    }).content
  )

  res.status(200).json({
    Quiz,
    translation,
  })
}
