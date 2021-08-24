const fs = require("fs");
const path = require('path');


function compareJsons(mainJson, jsonToCheck, jsonFilename) {
  for(let [key, value] of Object.entries(mainJson)) {
    if(!jsonToCheck[key] || jsonToCheck[key] === '') {
      console.log(`In ${jsonFilename}, translation is missing for "${key}"`);
    }
  }
}

function main() {

  const dir = 'backend/localizations/translations/';
  const enUs = path.join(dir, 'en-US.json');
  const mainJson = JSON.parse(fs.readFileSync(enUs));

  fs.readdirSync(dir).forEach(languageFile => {
    const filePath = path.join(dir, languageFile);
    const languageJson = JSON.parse(fs.readFileSync(filePath));
    compareJsons(mainJson, languageJson, languageFile);
  });
}



main();