const { obtenerPregunta } = require("../../Backend/Controllers/quizController");

//obtener elementos del DOM
const lobby = document.getElementById('lobby');
const playing = document.getElementById('playing');
const result = document.getElementById('result');

const btnJugar = document.getElementById('btn-jugar');
const btnVerdadero = document.getElementById('btn-verdadero');
const btnFalso = document.getElementById('btn-falso');
const btnSiguiente = document.getElementById('btn-siguiente');
const btnSalir = document.getElementById('btn-salir');

const preguntaTexto = document.getElementById('pregunta-texto');
const timerTexto = document.getElementById('timer-texto');
const timerProgreso = document.getElementById('timer-progreso');

const resultadoIcono = document.getElementById('resultado-icono');
const resultadoMensaje = document.getElementById('resultado-mensaje');
const puntosGanados = document.getElementById('puntos-ganados');
const puntajeTotal = document.getElementById('puntaje-total');

const API_URL = 'http://localhost:5000/quiz';


//variables de juego
let = preguntaActual = null;
let tiempoRestante = 30;
let intervalTimer = null;
let userId = 1; //por ahora hardcodeado


//funcion para cambiar estados de juego
function cambiarEstado(estadoActivo) {
    lobby.classList.remove('active');
    playing.classList.remove('active');
    result.classList.remove('active');

    estadoActivo.classList.add('active');
}


//iniciar juego
btnJugar.addEventListener('click', async () => {
    await obtenerPregunta();
    cambiarEstado(playing);
    iniciarTimer();
})
