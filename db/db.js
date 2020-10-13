const cls = require("cls-hooked");
const Sequelize = require('sequelize');
const dbConfig = require("./dbconfig");


// This is needed for sequelize not to have to include transaction object for every query.
// You can find more information at
// https://sequelize.org/master/manual/transactions.html#automatically-pass-transactions-to-all-queries
const namespace = cls.createNamespace('transaction-namespace');
Sequelize.useCLS(namespace);


// Sequalize client object, cached for connection pool
let sequelize = null;

function getSequelizeFromConfig() {
  if(!sequelize) {
    sequelize = new Sequelize(
      dbConfig.dbName,
      dbConfig.username,
      dbConfig.password,
      {
        host: dbConfig.host,
        port: dbConfig.port,
        dialect: dbConfig.dialect,
        dialectOptions: {
          ssl: {
            require: true,
            rejectUnauthorized: false
          }
        }
      }
    );
  }
  return sequelize;
}


async function testConnection() {
  const sequelize = getSequelizeFromConfig();

  try {
    await sequelize.authenticate();
    console.log('DB connection has been established successfully.');
    return true;
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    return false;
  }
}
  

module.exports = { getSequelizeFromConfig, testConnection };