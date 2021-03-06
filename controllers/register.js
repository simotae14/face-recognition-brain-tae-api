const handleRegister = (req, res, db, bcrypt) => {
  const {
    email,
    name,
    password
  } = req.body;
  // validate empty values
  if (!email || !name || !password) {
    return res.status(400).json('incorrect form submission');
  }
  const hash = bcrypt.hashSync(password);
  // add transaction
  db.transaction(trx => {
    trx.insert({
      hash,
      email
    })
    .into('login')
    .returning('email')
    .then(loginEmail => {
      // knex add item
      return trx('users')
        // returning value
        .returning('*')
        .insert({
          name,
          email: loginEmail[0],
          joined: new Date()
        })
        // return the json object of all the users
        .then(user => {
          res.json(user[0]);
        })
    })
    .then(trx.commit)
    .catch(trx.rollback)
  })
  // replace the real error with a generic error
  //.catch(err => res.status(400).json(err));
  .catch((err) => res.status(400).json("unable to register" + err));
};

module.exports = {
  handleRegister
};