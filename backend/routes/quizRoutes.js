import express from 'express';
import quizController from '../controllers/quizController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/pregunta', quizController.obtenerPregunta);

//validar respuesta
router.post('/respuesta', auth, quizController.validarRespuesta);

router.get('/puntaje', auth, quizController.obtenerPuntaje);

export default router;