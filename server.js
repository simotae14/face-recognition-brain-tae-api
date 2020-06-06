const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');

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
  database.users.push({
    id: '125',
    name,
    email,
    entries: 0,
    joined: new Date()
  });
  res.json(database.users[database.users.length - 1]);
});

// profile route
app.get('/profile/:id', (req, res) => {
  // grab id
  const { id } = req.params;
  let found = false;
  database.users.forEach( user => {
    if(user.id === id) {
      found = true;
      return res.json(user);
    }
  });
  if (!found) {
    res.status(404).json('not found');
  }
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
