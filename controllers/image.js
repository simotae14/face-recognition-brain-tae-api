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
  handleImage
};