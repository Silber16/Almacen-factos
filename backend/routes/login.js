import express from "express";
import loginController from "../Controllers/login.js";
import auth from "../Middleware/auth.js";
const router = express.Router();
router.post('/register' , loginController.register);
router.post('/login' , loginController.login);
router.get('/me', auth, loginController.me);
export default router;