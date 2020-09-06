const { Client } = require('pg');
const axios = require("axios");

const calculateStreamer = (quizValues, callback) => {

  console.log("Do something with these values and return a streamer's information")
  console.log(quizValues)
  // Run calculations....

  // TODO calculate a streamer and not just get Jinri
  const url = process.env.GET_JINRITV_DATA;

  const getData = async url => {
    try {
      const response = await axios.get(url, {
        headers: {
          'X-DreamFactory-API-Key': process.env.API_KEY,
          'X-DreamFactory-Session-Token': process.env.SESSION_TOKEN
        }
       })
  
      const data = response.data.resource[0];
      console.log(data);
      callback(data, null)
    } catch (error) {
      console.log(error);
      callback(null, error)
    }
  };

  getData(url);

  /*
  const postGresql = new Client({
    connectionString: process.env.DATABASE_URL, // Loaded from the environment variables (the secret .env file)
    ssl: {
      rejectUnauthorized: false
    }
  })

  postGresql.connect(err => {
    if (err) {
      console.error('connection error')
      callback(null, err.message)
    } else {
      console.log('connected')
      // Query database for streamer
      postGresql.query(streamerQuery, (err, res) => {
        if (err) {
          console.log(err.stack)
          callback(null, err.message)
        } else {
          console.log(res.rows[0])
          // Return selected streamer
          callback(res.rows[0], null)
        }
      })
    }
  })
  */
}

const streamerQuery = {
  // give the query a unique name
  name: 'get-streamer',
  text: 'SELECT * FROM streamers WHERE id = $1',
  values: [1],
}


module.exports = calculateStreamer