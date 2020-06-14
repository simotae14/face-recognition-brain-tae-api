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

// select knex
db.select('*').from('users')
  // promise select
  .then(data => console.log(data));

const app = express();

// use body
app.use(express.json());
// use cors
app.use(cors());


// mocked DB
const database = {
  users: [
    {
      id: '123',
      name: 'John',
      email: 'john@gmail.com',
      password: 'cookies',
      entries: 0,
      joined: new Date()
    },
    {
      id: '124',
      name: 'Sally',
      email: 'sally@gmail.com',
      password: 'bananas',
      entries: 0,
      joined: new Date()
    }
  ],
  login: [
    {
      id: '987',
      hash: '',
      email: 'john@gmail.com'
    }
  ]
}

// root route
app.get('/', (req, res) => {
  res.send(database.users);
});

// signin route
app.post('/signin', (req, res) => {
  /*
  bcrypt.compare("apples", '$2a$10$pcluhyxwvfWiE4lszM5sAeOMPYdpLfwgEbOc0DeEuNTyBGNK54sJ6', (err, res) => {
    console.log('first guess', res);
  });
  bcrypt.compare("veggies", '$2a$10$pcluhyxwvfWiE4lszM5sAeOMPYdpLfwgEbOc0DeEuNTyBGNK54sJ6', (err, res) => {
    console.log('second guess', res);
  });
  */
  if(req.body.email === database.users[0].email && req.body.password === database.users[0].password) {
    res.json(database.users[0]);
  } else {
    res.status(400).json('error logging in');
  }
});

// register route
app.post('/register', (req, res) => {
  const {
    email,
    name,
    password
  } = req.body;
  bcrypt.hash(password, null, null, (err, hash) => {
    console.log(hash);
  });
  // knex add item
  db('users')
    // returning value
    .returning('*')
    .insert({
      name,
      email,
      joined: new Date()
    })
    // return the json object of all the users
    .then(user => {
      res.json(user[0]);
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
  let found = false;
  database.users.forEach( user => {
    if(user.id === id) {
      found = true;
      user.entries++;
      return res.json(user.entries);
    }
  });
  if (!found) {
    res.status(404).json('not found');
  }
})

app.listen(8080, () => {
  console.log('app is running on port 8080');
});
