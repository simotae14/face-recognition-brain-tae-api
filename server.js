const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const db = knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    user: 'postgres',
    password: 'test',
    database: 'smart-brain'
  }
});

const app = express();

// use body
app.use(express.json());
// use cors
app.use(cors());

// root route
app.get('/', (req, res) => {
  res.send(database.users);
});

// signin route
app.post('/signin', (req, res) => {
  db.select('email', 'hash').from('login')
    .where('email', '=', req.body.email)
    .then(data => {
      // check if the email inserted is equals the one hashed
      const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
      if (isValid) {
        // respond with the user
        return db.select('*').from('users')
          .where('email',  '=', req.body.email)
          .then(user => {
            res.json(user[0]);
          })
          .catch(err => res.status(400).json('unable to get user'));
      } else {
        res.status(400).json('wrong credentials');
      }
    })
    .catch(err => res.status(400).json('wrong credentials'));;
});

// register route
app.post('/register', (req, res) => {
  const {
    email,
    name,
    password
  } = req.body;
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
  .catch(() => res.status(400).json("unable to register"));
});

// profile route
app.get('/profile/:id', (req, res) => {
  // grab id
  const { id } = req.params;
  db.select('*').from('users').where({
    id
  })
    .then(user => {
      if(user.length) {
        res.json(user[0]);
      } else {
        res.status(400).json('Not found');
      }
    })
    // catch errors
    .catch(() => res.status(400).json('error getting user'));

});

// image route
app.put('/image', (req, res) => {
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
})

app.listen(8080, () => {
  console.log('app is running on port 8080');
});
