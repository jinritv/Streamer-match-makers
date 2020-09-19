
// Test DB connection with config from /db/dbconfig.js

const { testConnection } = require("../db/db");

if(require.main === module) {
  testConnection();
}
