const express = require('express');
const router = express.Router();
const loginController = require('../Controllers/login');
const auth = require(' ../middleware/auth');
router.post('/register' , logincontroller.register);
router.post('/login' , logincontroller.login);
router.get(' /me' , loginController.me);
module.exports = router;