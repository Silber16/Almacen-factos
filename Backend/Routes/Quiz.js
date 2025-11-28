const express = require('express');
const router = express.Router();
const quizController = require('../Controllers/quizController');

//este url se ejecuta cuando se muestra la pregunta al usuario
router.get('/pregunta', quizController.obtenerPregunta);

//este url se ejecuta cuando el usuario elige verdadero o falso
router.post('/respuesta', quizController.validarRespuesta);


module.exports = router;

//en el controlador del quiz van las funciones que se realizan al ejecutarse estos urls