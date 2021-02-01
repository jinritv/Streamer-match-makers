const cls = require("cls-hooked");
const Sequelize = require("sequelize");
const dbConfig = require("./dbconfig");

// This is needed for sequelize not to have to include transaction object for every query.
// You can find more information at
// https://sequelize.org/master/manual/transactions.html#automatically-pass-transactions-to-all-queries
const namespace = cls.createNamespace("transaction-namespace");
Sequelize.useCLS(namespace);

// Sequalize client object, cached for connection pool
let sequelize = null;

function getSequelizeFromConfig() {
  if (!sequelize) {
    // Different SSL option for localhost and remote connection
    let dialectOptions = {};
    if (isRemote(dbConfig.host)) {
      dialectOptions.ssl = {
        require: true,
        rejectUnauthorized: false,
      };
    }

    sequelize = new Sequelize(
      dbConfig.dbName,
      dbConfig.username,
      dbConfig.password,
      {
        host: dbConfig.host,
        port: dbConfig.port,
        dialect: dbConfig.dialect,
        dialectOptions: dialectOptions,
      }
    );
  }
  return sequelize;
}

/**
 * Very basic check if the hostname is remote address
 * A hostname is treated as remote if it is not "localhost" or "127.0.0.1"
 */
function isRemote(host) {
  if (!host) {
    // This is input error and will be handled by Sequelize later
    return true;
  }
  const trimmed = host.trim().toLowerCase();
  return trimmed !== "localhost" && trimmed !== "127.0.0.1";
}

async function testConnection() {
  const sequelize = getSequelizeFromConfig();

  try {
    await sequelize.authenticate();
    console.log("DB connection has been established successfully.");
    return true;
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    return false;
  }
}

module.exports = { getSequelizeFromConfig, testConnection };
