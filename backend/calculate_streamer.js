const calculateStreamer = (quizValues, callback) => {

  console.log("Do something with these values and return a streamer's information")
  console.log(quizValues['quizResults[]'])
  // Run calculations....

  // Access database...

  // Return selected streamer
  var selectedStreamer = {
    Name: "Jinri",
    Reason: "Highest overall value"
  }

  callback(selectedStreamer, null)
}

module.exports = calculateStreamer