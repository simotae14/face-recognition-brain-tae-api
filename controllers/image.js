const Clarifai = require('clarifai');

/* create Clarifai instance */
const app = new Clarifai.App({
  apiKey: "28faa7794f384cceb38d6a8f8260ce26"
});

// handler to pass the image url
const handleImageUrlApi = (req, res) => {
  app.models.predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then(data => res.json(data))
    .catch(error => res.status(400).json('unable to work with api'));
}

const handleImage = (req, res, db) => {
  // grab id
  const { id } = req.body;
  // increment entries
  db('users')
    .where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
      res.json(entries[0]);
    })
    .catch(error => res.status(400).json('unable to get entries'));
};

module.exports = {
  handleImage,
  handleImageUrlApi
};