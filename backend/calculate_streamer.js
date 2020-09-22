const { Client } = require('pg');
const axios = require("axios");



// TODO: Fix the API

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
}

module.exports = calculateStreamer