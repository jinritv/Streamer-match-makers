
/**
 * 
 * Script to recreate your DB from the spreadsheet, when the DB is messed up or you are a new member.
 * 
 * Usage
 * If your path to the downloaded CSV file is C:/data/streamer.csv, then run this command in terminal.
 * $ node recreate_database.js C:/data/streamer.csv
 * 
 */

const { getSequelizeFromConfig, testConnection} = require("../db/db");
const fs = require("fs");
const { QueryTypes } = require("sequelize");
const { findOrCreateStreamerFromData } = require("../db/find_or_create_streamer");
const { validateData } = require("../validation/validator");

// TODO: Is there any lighter alternative to D3-DSV for CSV parsing?
const d3 = require("d3-dsv");

// DB schema file
const dbSchemaFilePath = "../db/db.sql";
const defaultEncoding = "utf8";

// CSV streamer data file
const streamerDataFilePath = process.argv[2]// || "C:/Code/streamer/data.csv";  // TODO: accept user input later
const headerRowNum = 1;  // 0-based row index of header columns
const dataStartRowNum = 4;  // 0-based row index of start of data

// DB schema name
const postgresSchemaName = "public";


async function recreateDatabase() {
  if(!testConnection) {
    console.log("Connection DB failed. Aborting..");
    return;
  }

  try {
    // Step 1. Drop and re-create all tables
    console.log("Recreating the schema and tables...")
    await recreateSchema();
    console.log("Successfully recreated DB schema and tables");

    // Step 2. Populate all data from CSV file
    console.log("Reading CSV file to get streamer data...")
    const csvFileData = fs.readFileSync(streamerDataFilePath, defaultEncoding);
    const csvJsonData = parseCsvDataToJson(csvFileData);
    console.log(`Total ${csvJsonData.length} streamer data are found. Updating DB...`);

    const errorsByStreamer = await populateData(csvJsonData);
    const errorCount = Object.keys(errorsByStreamer).length;
    if(errorCount) {
	  console.log("\n\n\n\n");
	  console.log(`${csvJsonData.length - errorCount} streamers were added to DB`);
      console.log(`${errorCount} streamers are not added to DB`);
      console.log(JSON.stringify(errorsByStreamer, null, 2));
    }
  }
  catch(error) {
    console.log("Error while recreating database. ");
    console.log(error);
    return;
  }
}

async function recreateSchema() {
  const schemaSql = fs.readFileSync(dbSchemaFilePath, defaultEncoding);
  const sequelize = getSequelizeFromConfig();
  // Simply dropping tables with sequelize.drop() caused errors when creating tables,
  // saying that "relation OOO already exists". 
  // Does PostgresSQL not delete relations upon drop?
  // Therefore, we have to drop and create the schema itself, not just tables.
  await sequelize.dropSchema(postgresSchemaName);
  await sequelize.createSchema(postgresSchemaName);
  await sequelize.query(schemaSql, {type: QueryTypes.RAW});
}

async function populateData(csvJsonData) {
  const errorsByStreamer = {};
  for(let streamerData of csvJsonData) {
    const errors = await findOrCreateStreamerFromData(streamerData);
    //const [_, errors] = validateData(streamerData);
    if(errors && Object.keys(errors).length > 0) {
      errorsByStreamer[streamerData.user_name] = errors;
    }
  }
  return errorsByStreamer;
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
  const headerRow = csvRows[headerRowNum];
  const dataRows = csvRows.slice(dataStartRowNum);
  // Filter out rows that are not header or data
  const sanitizedCsvData = d3.csvFormatRows([headerRow, ...dataRows]);
  // Each row is object of [dbcolumn]:value, i.g. {user_name: "Jinritv", streamer_extra: "Jinri Lee", ...}
  const csvObjectRows = d3.csvParse(sanitizedCsvData);
  return csvObjectRows;
}

recreateDatabase();