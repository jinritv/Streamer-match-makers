var mysql = require('mysql');

const { Pool, Client } = require('pg')

/****
Edit these database connection values for your local server
*/
const USER_CREDENTIALS = {
  Username: "YOUR_USERNAME",
  Password: "YOUR_PASSWORD"
};

/***
Shouldn't need to change these values, we can leave them at default
*/
const DATABASE_CONNECTION = {
  Host: "localhost",
  Database: "jinritv",
  StreamerTable: "streamers",
  ...USER_CREDENTIALS
};

// The SQL query we will run on the MySQL server once we are connected to create the database. 
const initializeDB = `CREATE DATABASE IF NOT EXISTS ${DATABASE_CONNECTION.Database}; 
CREATE TABLE IF NOT EXISTS ${DATABASE_CONNECTION.Database}.${DATABASE_CONNECTION.StreamerTable} (
  id INT AUTO_INCREMENT PRIMARY KEY, 
  user_name varchar(45) DEFAULT NULL, 
  display_name varchar(45) DEFAULT NULL, 
  streamer_name varchar(45) DEFAULT NULL,
  is_partner tinyint DEFAULT NULL,
  streamer_extra varchar(45) DEFAULT NULL,
  stream_start_date date DEFAULT NULL,
  avg_viewers int DEFAULT NULL,
  followers int DEFAULT NULL,
  is_fulltime tinyint DEFAULT NULL,
  avg_duration int DEFAULT NULL,
  streamer_age int DEFAULT NULL,
  streamer_dob date DEFAULT NULL,
  languages longtext,
  ethnicity longtext,
  location varchar(45) DEFAULT NULL,
  categories longtext,
  tags longtext,
  collabs mediumtext,
  voice int DEFAULT NULL,
  uses_cam tinyint DEFAULT NULL,
  streams_per_week int DEFAULT NULL,
  avg_start_time datetime DEFAULT NULL,
  viewer_engagement tinyint DEFAULT NULL,
  does_collabs tinyint DEFAULT NULL,
  drinks_alcohol tinyint DEFAULT NULL,
  word_cloud longtext,
  is_mature tinyint DEFAULT NULL,
  modified_at datetime DEFAULT NULL,
  image_link varchar(45) DEFAULT NULL,
  streamerscol mediumtext
) COMMENT='Database for the streamer matchmaker project for JinriTV Twitch channel.';`;

const initializeDatabase = (callback) => {

  /*

  var con = mysql.createConnection({
    host: DATABASE_CONNECTION.Host,
    user: DATABASE_CONNECTION.Username,
    password: DATABASE_CONNECTION.Password,
    multipleStatements:true
  });

  const connectionCallback = (err) => {
    if (err==null){
      // Connected, initialize the database and return the result with the callback
      con.query(initializeDB, callback) 
    }else {
      callback(err); // If we cannot connect to the database server, return an error
    }
  }

  // Connect to the database server, and handle the result in the callback.
  con.connect(connectionCallback);
  */

  // Post gresl

  const connectionString = 'postgres://hqrvrkekcyfbzv:d669d5385fdd1a282785b41e49a2c8f6777d4bd9d2fc85fcb2b21c3d817753e1@ec2-35-175-155-248.compute-1.amazonaws.com:5432/d3b19l0h63488d'

  const client = new Client({
    connectionString: connectionString,
    ssl: {
      rejectUnauthorized: false
    }
  });

  client.connect(err => {
    if (err) {
      console.error('connection error', err.stack)
      callback(err)
    } else {
      console.log('connected')
      callback()
    }
  })

  // client.query(initializeDB, (err, res) => {
  //   if (err) callback(err);
    
  //   // No error
  //   client.end();
  // });

}

module.exports = initializeDatabase