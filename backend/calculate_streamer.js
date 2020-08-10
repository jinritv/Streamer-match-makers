const { Client } = require('pg')

const calculateStreamer = (quizValues, callback) => {

  console.log("Do something with these values and return a streamer's information")
  console.log(quizValues['quizResults[]'])
  // Run calculations....

  // Access database...
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
}

const streamerQuery = {
  // give the query a unique name
  name: 'get-streamer',
  text: 'SELECT * FROM streamers WHERE id = $1',
  values: [1],
}


module.exports = calculateStreamer