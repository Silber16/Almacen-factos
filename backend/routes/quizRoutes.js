import express from 'express';
import quizController from '../controllers/quizController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/start', auth, quizController.startQuiz);

router.post('/verify', auth, quizController.verifyAnswer);

router.post('/score', auth, quizController.updateScore);

router.post('/survival/check', auth, quizController.checkSurvivalAnswer);

export default router;