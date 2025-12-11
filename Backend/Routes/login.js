const express = require('express');
const router = express.Router();
const loginController = require('../Controllers/login');
router.post('/register' , logincontroller.register);
router.post('/login' , logincontroller.login);
module.exports = router;