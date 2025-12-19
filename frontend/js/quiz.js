// Obtener elementos del DOM
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
const linkFuente = document.getElementById('link-fuente');
const verFacto = document.getElementById('ver-facto');
const btnVerFacto = document.getElementById('btn-ver-facto');
const btnVolverResultado = document.getElementById('btn-volver-resultado');
const factoRevisionTexto = document.getElementById('facto-revision-texto');
const btnVerdaderoRevision = document.getElementById('btn-verdadero-revision');
const btnFalsoRevision = document.getElementById('btn-falso-revision');

// URL API
const API_URL = 'http://localhost:3000/api/quiz';

// Variables de juego
let quizIdActual = null; 
let tiempoRestante = 30;
let intervalTimer = null; 
let explicacionIA = ""; 
let fuenteUrl = ""; 
let respuestaCorrectaBoolean = null; 
let textoPreguntaMostrada = ""; // <--- AQUÍ GUARDAREMOS LO QUE SALIÓ EN PLAYING

function cambiarEstado(estadoActivo) {
    lobby.classList.remove('active');
    playing.classList.remove('active');
    result.classList.remove('active');
    verFacto.classList.remove('active'); 
    estadoActivo.classList.add('active');
}

function detenerTimer() {
    if (intervalTimer) {
        clearInterval(intervalTimer);
        intervalTimer = null;
    }
}

async function obtenerPregunta() {
    try {
        const response = await fetch(`${API_URL}/pregunta`);
        const data = await response.json();
        quizIdActual = data.quizId;
        
        // Guardamos el texto para repetirlo en la revisión
        textoPreguntaMostrada = data.question; 
        preguntaTexto.textContent = textoPreguntaMostrada;
        
        fuenteUrl = data.fuente || ""; 
    } catch (error) {
        console.error('Error:', error);
    }
}

function iniciarTimer() {
    detenerTimer(); 
    tiempoRestante = 30;
    timerTexto.textContent = tiempoRestante;
    timerProgreso.style.width = '100%';
    intervalTimer = setInterval(() => {
        tiempoRestante--;
        timerTexto.textContent = tiempoRestante;
        timerProgreso.style.width = (tiempoRestante / 30 * 100) + '%';
        if (tiempoRestante <= 0) {
            detenerTimer();
            manejarTimeout();
        }
    }, 1000);
}

async function validarRespuesta(respuestaUsuario) {
    detenerTimer();
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`${API_URL}/respuesta`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ quizId: quizIdActual, respuestaUsuario: respuestaUsuario })
        });
        const data = await response.json();
        explicacionIA = data.mensaje; 
        respuestaCorrectaBoolean = data.respuestaCorrecta; 
        mostrarResultado(data);
    } catch (error) { console.error(error); }
}

function mostrarResultado(data) {
    detenerTimer();
    resultadoIcono.textContent = data.correcto ? '✅' : '❌';
    resultadoMensaje.textContent = data.correcto ? '¡CORRECTO!' : '¡INCORRECTO!';
    puntosGanados.textContent = data.correcto ? "10" : "0";
    puntajeTotal.textContent = data.nuevoPuntaje || "0";

    if (fuenteUrl) {
        linkFuente.href = fuenteUrl;
        linkFuente.style.display = 'inline-block';
    } else {
        linkFuente.style.display = 'none';
    }
    cambiarEstado(result);
}

// BOTONES
btnJugar.onclick = async () => { await obtenerPregunta(); cambiarEstado(playing); iniciarTimer(); };
btnVerdadero.onclick = () => validarRespuesta(true);
btnFalso.onclick = () => validarRespuesta(false);
btnSiguiente.onclick = async () => { await obtenerPregunta(); cambiarEstado(playing); iniciarTimer(); };
btnSalir.onclick = () => { detenerTimer(); cambiarEstado(lobby); };
btnVerFacto.onclick = (e) => { e.preventDefault(); mostrarFactoCompleto(); };
btnVolverResultado.onclick = () => cambiarEstado(result);

// REVISIÓN CORREGIDA
function mostrarFactoCompleto() {
    // 1. Mostramos EL MISMO TEXTO que vio en el estado Playing
    factoRevisionTexto.textContent = textoPreguntaMostrada;

    // 2. Limpiamos clases
    btnVerdaderoRevision.classList.remove('correcta', 'correcta-falso');
    btnFalsoRevision.classList.remove('correcta', 'correcta-falso');

    // 3. Pintamos el botón que era el correcto
    if (respuestaCorrectaBoolean === true) {
        btnVerdaderoRevision.classList.add('correcta');
    } else if (respuestaCorrectaBoolean === false) {
        btnFalsoRevision.classList.add('correcta-falso');
    }
    
    cambiarEstado(verFacto);
}