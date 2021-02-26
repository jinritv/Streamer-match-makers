const calculateStreamer = require('../../backend/calculate_streamer')

export default function handler(req, res) {
  const quizResultsCallback = (results, err) => {
    res.json({
      Error: err,
      Results: results,
    })
  }

  calculateStreamer(req.body, quizResultsCallback)
}
