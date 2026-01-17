import express from 'express';
import quizController from '../controllers/quizController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/start', auth, quizController.startQuiz);

router.post('/verify', auth, quizController.verifyAnswer);

router.post('/score', auth, quizController.updateScore);

export default router;