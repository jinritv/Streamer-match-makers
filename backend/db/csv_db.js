

const fs = require("fs");
const d3 = require("d3-dsv");

// TODO: Is it a good idea to load env variables here, or per each entry point?
if (process.env.NODE_ENV !== "production") {
  const envPath = require("path").join(__dirname, "..", "..", ".env");
  require("dotenv").config({ path: envPath });
}

const dataStartRowNum = 3; // 0-based row index of start of data

function parseLanguages(languagesString) {
  const split = languagesString.split("/");
  const languages = [];
  for(const item of split) {
    const trimmed = item.trim();
    if(trimmed !== "") {
      // to upper case is needed to guard against inconsistent data, EN, En , en
      languages.push(trimmed.toUpperCase());
    }
  }
  return languages;
}

function parseCategories(categoriesString) {
  const split = categoriesString.split(",");
  const categories = [];
  for(const item of split) {
    const trimmed = item.trim();
    if(trimmed !== "") {
      categories.push(trimmed);
    }
  }
  return categories;
}

function parseChatVibes(chatVibesString) {
  const split = chatVibesString.split(",");
  const chatVibes = [];
  for(const item of split) {
    const trimmed = item.trim();
    if(trimmed !== "") {
      // to lower case is needed to make sure no case difference cause issue in matching
      // Ex: Funny (in DB) vs funny (in input)
      chatVibes.push(trimmed.toLowerCase());
    }
  }
  return chatVibes;
}

function parseGender(rawGender) {
  const trimmed = rawGender.trim();
  if (trimmed.toUpperCase() == "F") {
    return "F";
  } else if (trimmed.toUpperCase() == "M") {
    return "M";
  }
  return "";
}

function parseAvgViewer(rawAvgViewer) {
  let i = parseInt(rawAvgViewer.replace(',', ''));
  if (Number.isNaN(i)) {
    return null;
  }
  return i;
}

// Gets string content of CSV file, parses it into array of {[dbcolumn]:value}
function parseCsvDataToJson(csvFileData) {
  // See https://github.com/d3/d3-dsv#dsv_format for more information about d3-dsv functions.

  // This function does the following:
  // 1. Parse CSV data into cells grouped by rows
  // 2. Remove rows that are not columns or actual data
  // 3. Convert the remaining rows back to a CSV data string
  // 4. Parse the string from the previous step to an array of {[dbcolumn]:value} objects.

  // The reason for using d3-dsv's parse-format-parse functions, and not using string manipulation functions
  // to filter out irrelevant rows, is that a CSV cell may have data with newlines (i.g. "Line1\nLine2")
  // and string manipulation functions break in such case.

  // Each row is array of string cell value, i.g. [Jinritv", "Jinri Lee", "N", ...]
  const csvRows = d3.csvParseRows(csvFileData);
  // const headerRow = csvRows[headerRowNum];
  const dataRows = csvRows.slice(dataStartRowNum);
  // Filter out rows that are not header or data
  // const sanitizedCsvData = d3.csvFormatRows([headerRow, ...dataRows]);
  // Each row is object of [dbcolumn]:value, i.g. {user_name: "Jinritv", streamer_extra: "Jinri Lee", ...}
  // const csvObjectRows = d3.csvParse(sanitizedCsvData);
  const csvJsonList = [];
  for(const dataRow of dataRows) {
    if(dataRow[21] !== "DONE") {
      continue;
    }
    const dataJson = {
      id: dataRow[1].toLowerCase(),
      user_name: dataRow[1].toLowerCase(),
      nickname: dataRow[2],
      logo: null,
      mature_stream: dataRow[7].toUpperCase() === "TRUE",
      gender: parseGender(dataRow[11]),
      avg_viewers: parseAvgViewer(dataRow[14]),
      languages: parseLanguages(dataRow[3]),
      categories: parseCategories(dataRow[12]),
      chat_vibes: parseChatVibes(dataRow[4])
    };
    csvJsonList.push(dataJson);
  }
  return csvJsonList;
}


class CsvDatabase {
  constructor(csv_path) {
    this.csv_path = csv_path;
    this.csv_content = fs.readFileSync(csv_path, {encoding:'utf8', flag:'r'});
    this.csv_json = parseCsvDataToJson(this.csv_content);
  }

  getAllStreamers() {
    return this.csv_json;
  }
}

module.exports = { CsvDatabase };
