const calculateStreamer = require('../../backend/calculate_streamer')

export default function handler(req, res) {
  calculateStreamer(req.body, (results, error) => {
    res.status(200).json({
      Error: error,
      Results: results,
    })
  })
}
