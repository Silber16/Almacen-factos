const express = require('express');
const router = express.Router();
const quizController = require('../Controllers/quizController');

//esta url se ejecuta cuando se muestra la pregunta al usuario
router.get('/pregunta', quizController.obtenerPregunta);

//esta url se ejecuta cuando el usuario elige verdadero o falso
router.post('/respuesta', quizController.validarRespuesta);

router.get('/puntaje/:userId', quizController.obtenerPuntaje);


module.exports = router;

//en el controlador del quiz van las funciones que se realizan al ejecutarse estos urls