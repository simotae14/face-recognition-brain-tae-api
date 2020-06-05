const express = require('express');

const app = express();

// use body
app.use(express.json());

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
  ]
}

// root route
app.get('/', (req, res) => {
  res.send(database.users);
});

// signin route
app.post('/signin', (req, res) => {
  if(req.body.email === database.users[0].email && req.body.password === database.users[0].password) {
    res.json('success');
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
  database.users.push({
    id: '125',
    name,
    email,
    password,
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

app.listen(3000, () => {
  console.log('app is running on port 3000');
});

/*
basic routes:

/ --> response = this is working
/signin -> POST = success/fail
/register -> POST = user
/profile/:userId => GET = user
/image => PUT = user
*/