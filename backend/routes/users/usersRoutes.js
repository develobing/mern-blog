const express = require('express');
const {
  userRegisterCtrl,
  loginUserCtrl,
} = require('../../controllers/users/usersCtrl');

const usersRoutes = express.Router();

// User Registered
usersRoutes.post('/register', userRegisterCtrl);

// User login
usersRoutes.post('/login', loginUserCtrl);

// User Fetch
usersRoutes.get('/', (req, res) => {
  res.json({
    user: 'Fetch all users',
  });
});

module.exports = usersRoutes;
