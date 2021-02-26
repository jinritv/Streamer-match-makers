const createStreamer = require('../../backend/create_streamer')

export default function handler(req, res) {
  const createStreamerCallback = (results, err) => {
    res.json({
      Error: err,
      Results: results,
    })
  }

  createStreamer(req.body.newStreamer, createStreamerCallback)
}
