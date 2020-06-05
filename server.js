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
  res.send('this is working');
});

// signin route
app.post('/signin', (req, res) => {
  if(req.body.email === database.users[0].email && req.body.password === database.users[0].password) {
    res.json('success');
  } else {
    res.status(400).json('error logging in');
  }
});

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