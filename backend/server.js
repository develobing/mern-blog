require('dotenv').config();
const express = require('express');
const dbConnect = require('./config/db/dbConnect');
const { userRegisterCtrl } = require('./controllers/users/usersCtrl');

const app = express();

// DB
dbConnect();

app.use(express.json());

// User Registered
app.post('/api/users/register', userRegisterCtrl);

// User login
app.post('/api/users/login', (req, res) => {
  res.json({
    user: 'User login successfully',
  });
});

// User login
app.get('/api/users', (req, res) => {
  res.json({
    user: 'Fetch users',
  });
});

// Server
const PORT = process.env.PORT || 5005;
app.listen(PORT, console.log(`Server started on port ${PORT}`));
