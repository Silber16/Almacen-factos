import express from 'express';
import quizController from '../controllers/quizController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/pregunta', quizController.obtenerPregunta);

router.post('/respuesta', auth, quizController.validarRespuesta);

router.get('/puntaje', auth, quizController.obtenerPuntaje);

router.get('/respuesta-timeout/:quizId', auth, quizController.obtenerRespuestaTimeout);

export default router;