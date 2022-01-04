
const { CsvDatabase } = require("./csv_db");
const path = require("path");

// TODO: Is it a good idea to load env variables here, or per each entry point?
if (process.env.NODE_ENV !== "production") {
  const envPath = path.join(__dirname, "..", "..", ".env");
  require("dotenv").config({ path: envPath });
}

function getDatabase() {
  const dbType = process.env.DB_TYPE || "csv";
  console.log("dbType: " + dbType);
  switch (dbType.toLowerCase()) {
    case "postgres":
      break;
    case "spreadsheet":
      break;
    case "csv":
      const db_path = process.env.DB_PATH || path.join(__dirname, "..", "..", "db.csv");
      return new CsvDatabase(db_path);
    default:
      throw new Error("No db type is specified");
  }
}

module.exports = { getDatabase };