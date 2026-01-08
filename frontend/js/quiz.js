// Elementos del DOM
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

const API_URL = 'http://localhost:3000/api/quiz';


let quizIdActual = null; 
let tiempoRestante = 30;
let intervalTimer = null; 
let explicacionIA = ""; 
let fuenteUrl = ""; 
let respuestaCorrectaBoolean = null; 
let textoPreguntaMostrada = ""; 


function cambiarEstado(estadoActivo) {
    [lobby, playing, result, verFacto].forEach(s => s.classList.remove('active'));
    estadoActivo.classList.add('active');
}

//limpiar intervalos
function detenerTimer() {
    if (intervalTimer) {
        clearInterval(intervalTimer);
        intervalTimer = null;
    }
}


async function obtenerPregunta(boton) {
    const textoOriginal = boton.innerHTML;

    try {

        boton.disabled = true;
        boton.innerHTML = '⌛ Generando...';
        boton.style.opacity = "0.7";

        const response = await fetch(`${API_URL}/pregunta`);
        const data = await response.json();
        
        quizIdActual = data.quizId;
        textoPreguntaMostrada = data.question; 
        preguntaTexto.textContent = textoPreguntaMostrada;
        fuenteUrl = data.fuente || ""; 

        // Restaurar botón
        boton.disabled = false;
        boton.innerHTML = textoOriginal;
        boton.style.opacity = "1";
        return true;

    } catch (error) {
        console.error('Error:', error);
        boton.disabled = false;
        boton.innerHTML = textoOriginal;
        boton.style.opacity = "1";
        alert("Hubo un problema al conectar con la IA. Intentá de nuevo.");
        return false;
    }
}


function iniciarTimer() {
    detenerTimer(); 
    tiempoRestante = 30;
    timerTexto.textContent = tiempoRestante;
    timerProgreso.style.width = '100%';
    timerProgreso.classList.remove('alerta');
    timerTexto.classList.remove('alerta');

    intervalTimer = setInterval(() => {
        tiempoRestante--;
        timerTexto.textContent = tiempoRestante;
        timerProgreso.style.width = (tiempoRestante / 30 * 100) + '%';

        if (tiempoRestante <= 10) {
            timerProgreso.classList.add('alerta');
            timerTexto.classList.add('alerta');
        }
        if (tiempoRestante <= 0) {
            detenerTimer();
            manejarTimeout();
        }
    }, 1000);
}

async function manejarTimeout() {
    detenerTimer();
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`${API_URL}/respuesta-timeout/${quizIdActual}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        
        respuestaCorrectaBoolean = data.respuestaCorrecta;
        explicacionIA = data.mensaje;

        mostrarResultado({ correcto: false, nuevoPuntaje: data.puntajeTotal, timeout: true });
    } catch (error) {
        mostrarResultado({ correcto: false, timeout: true });
    }
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

    if (data.timeout) {
        resultadoIcono.textContent = '⏱️';
        resultadoMensaje.textContent = '¡TIEMPO AGOTADO!';
    } else {
        resultadoIcono.textContent = data.correcto ? '✅' : '❌';
        resultadoMensaje.textContent = data.correcto ? '¡CORRECTO!' : '¡INCORRECTO!';
    }

    puntosGanados.textContent = data.correcto ? "10" : "0";
    puntajeTotal.textContent = data.nuevoPuntaje || "0";

    if (fuenteUrl) {
        linkFuente.href = fuenteUrl;
        linkFuente.style.display = 'inline-block';
        linkFuente.target = "_blank";
    } else {
        linkFuente.style.display = 'none';
    }

    cambiarEstado(result);
}

//eventos de botones
btnJugar.onclick = async () => {
    const exito = await obtenerPregunta(btnJugar);
    if (exito) {
        cambiarEstado(playing);
        iniciarTimer();
    }
};

btnVerdadero.onclick = () => validarRespuesta(true);
btnFalso.onclick = () => validarRespuesta(false);

btnSiguiente.onclick = async () => {
    const exito = await obtenerPregunta(btnSiguiente);
    if (exito) {
        cambiarEstado(playing);
        iniciarTimer();
    }
};

btnSalir.onclick = () => {
    detenerTimer();
    cambiarEstado(lobby);
};

btnVerFacto.onclick = (e) => {
    e.preventDefault();
    mostrarFactoCompleto();
};

btnVolverResultado.onclick = () => cambiarEstado(result);


function mostrarFactoCompleto() {
    factoRevisionTexto.textContent = textoPreguntaMostrada;

    btnVerdaderoRevision.classList.remove('correcta', 'correcta-falso');
    btnFalsoRevision.classList.remove('correcta', 'correcta-falso');

    if (respuestaCorrectaBoolean === true) {
        btnVerdaderoRevision.classList.add('correcta');
    } else if (respuestaCorrectaBoolean === false) {
        btnFalsoRevision.classList.add('correcta-falso');
    }
    
    cambiarEstado(verFacto);
}