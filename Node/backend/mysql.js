var mysql = require('mysql');

const testConnection = (connectionValues, callback)=>{
  
  var con = mysql.createConnection({
    host: "localhost",
    user: connectionValues.Username,
    password: connectionValues.Password
  });

  con.connect(callback);

}

module.exports = testConnection