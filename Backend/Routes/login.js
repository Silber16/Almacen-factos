const express = require('express');
const router = express.Router();
const logincontroller = require('../Controllers/login.js');
const auth = require('../middleware/auth');
router.post('/register' , logincontroller.register);
router.post('/login' , logincontroller.login);
router.get('/me', auth, logincontroller.me);
module.exports = router;