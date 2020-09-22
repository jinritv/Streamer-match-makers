const { Client } = require('pg');

const createStreamer = (newStreamer, callback) => {

  // check for simple password before allowing the user to add a record to the db
  // password is stored in the environment variables
  if (newStreamer.password != process.env.CREATE_STREAMER_PASSWORD) {
    callback(null, "Wrong password.")
    return
  }

  console.log("Add new streamer:")
  console.log(newStreamer)
  const postGresql = new Client({
    connectionString: process.env.DATABASE_URL,
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
      let addStreamerQuery = createStreamerQuery(newStreamer)
      console.log(addStreamerQuery)
      // Query database for streamer
      postGresql.query(addStreamerQuery, (err, res) => {
        if (err) {
          console.log(err.stack)
          callback(null, err.message)
        } else {
          console.log(res)
          // Return selected streamer id
          console.log(`New Streamer ID: ${res.Results.rows[0].id}`)

          // insert other data
          // with query such as 
          /*
        insert into streamers_nationalities
        (
            streamer_id, 
            nationality_id, 
        ) 
        values
        (streamerid, 1),
        (streamerid, 2);
        */

          callback(res, null)
        }
      })
    }
  })

}

// Create new streamer and return the new streamer's id
const createStreamerQuery = (newStreamer) => {
  return {
    name: 'create-streamer',
    text: `insert into streamers
        (
            user_name, 
            display_name, 
            streamer_name, 
            is_partner, 
            is_fulltime, 
            uses_cam, 
            mature, 
            logo
        ) 
        values
        (
            $1, 
            $2, 
            $3, 
            $4, 
            $5, 
            $6, 
            $7, 
            $8
        ) 
        returning id;`,
    values: [newStreamer.user_name,
    newStreamer.display_name,
    newStreamer.streamer_name,
    newStreamer.is_partner,
    newStreamer.is_fulltime,
    newStreamer.uses_cam,
    newStreamer.mature_stream,
    newStreamer.logo_url],
  }
}

module.exports = createStreamer