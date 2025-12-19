import express from "express";
import loginController from "../controllers/login.js";
import auth from "../middleware/auth.js";
const router = express.Router();
router.post('/register' , loginController.register);
router.post('/login' , loginController.login);
router.get('/me', auth, loginController.me);
export default router;