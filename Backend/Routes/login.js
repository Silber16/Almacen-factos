const express = require('express');
const router = express.router();
const logincontroller = require('../Controllers/login');
router.post('/register' , logincontroller.register);
router.post('/login' , logincontroller.login);
module.exports = router;