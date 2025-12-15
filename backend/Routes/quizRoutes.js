import express from 'express';
import quizController from '../Controllers/quizController.js';

const router = express.Router();


//esta url se ejecuta cuando se muestra la pregunta al usuario
router.get('/pregunta', quizController.obtenerPregunta);

//esta url se ejecuta cuando el usuario elige verdadero o falso
router.post('/respuesta', quizController.validarRespuesta);

router.get('/puntaje/:userId', quizController.obtenerPuntaje);

export default router;

//en el controlador del quiz van las funciones que se realizan al ejecutarse estos urls