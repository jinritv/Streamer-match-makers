const cls = require("cls-hooked");
const Sequelize = require('sequelize');
const dbConfig = require("./dbconfig");


// This is needed for sequelize not to have to include transaction object
const namespace = cls.createNamespace('transaction-namespace');
Sequelize.useCLS(namespace);


// Sequalize client object, cached for connection pool
let sequelize = null;

console.log(JSON.stringify(dbConfig));

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
            }
        );
    }
    return sequelize;
}

module.exports = {getSequelizeFromConfig,testConnection};


async function testConnection() {
    const sequelize = getSequelizeFromConfig();

    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
        return true;
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        return false;
    }
}

//testConnection();