// TODO: Is it a good idea to load env variables here, or per each entry point?
if (process.env.NODE_ENV !== "production") {
  const envPath = require("path").join(__dirname, "..", ".env");
  require("dotenv").config({ path: envPath });
}

// Various config values for DB
const dbConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dbName: process.env.DB_NAME,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  dialect: "postgres",
};

module.exports = dbConfig;
