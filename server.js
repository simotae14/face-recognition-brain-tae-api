const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex({
  client: 'pg',
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const app = express();

// use body
app.use(express.json());
// use cors
app.use(cors());

// root route
app.get('/', (req, res) => { res.send("it works")});

// signin route
app.post('/signin', (req, res) => { signin.handleSignin(req, res, db, bcrypt) });

// register route
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) });

// profile route
app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db) });

// image route
app.put('/image', (req, res) => image.handleImage(req, res, db));

// imageurl route
app.post('/imageurl', (req, res) => image.handleImageUrlApi(req, res));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`app is running on port ${PORT}`);
});
