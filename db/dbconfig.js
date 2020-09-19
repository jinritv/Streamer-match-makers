

// Various config values for DB
const dbConfig = {
    host: process.env.DATABASE_URL || "localhost",
    port: process.env.DB_PORT || 5432,
    dbName: process.env.DB_NAME || "test_db3",
    username: process.env.DB_USERNAME || "postgres",
    password: process.env.DB_PASSWORD || "1234",
    dialect: "postgres",
}


module.exports = dbConfig;