const express = require('express');
const { signupUser, loginUser, refreshTokenUser, logoutUser } = require('../controllers/userController');

const router = express.Router();

// login route
router.post('/login', loginUser);

// signup route
router.post('/signup', signupUser);

router.post('/refresh-token', refreshTokenUser);

router.delete('/logout', logoutUser);

module.exports = router;
