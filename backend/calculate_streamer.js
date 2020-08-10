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
      // Return selected streamer
      var selectedStreamer = {
        Name: "Jinri",
        Reason: "Highest overall value"
      }
      callback(selectedStreamer, null)
    }
  })
}

module.exports = calculateStreamer