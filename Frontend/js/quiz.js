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

const API_URL = 'http://localhost:3030/quiz';


//variables de juego
let preguntaActual = null;
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

//obtener pregunta del back
async function obtenerPregunta() {
    try {
        const response = await fetch(`${API_URL}/pregunta`);
        const data = await response.json();

        preguntaActual = {
            factoId: data.id,
            texto: data.modified_content
        };

        preguntaTexto.textContent = data.modified_content;

    } catch (error) {
        console.error('Error al obtener pregunta:', error);
        alert('Error al cargar la pregunta. Intente de nuevo.')
    }
}


//iniciar el timer
function iniciarTimer() {
    tiempoRestante= 30;
    timerTexto.textContent = tiempoRestante;
    timerProgreso.style.width = '100%';
    timerProgreso.classList.remove('alerta');
    timerTexto.classList.remove('alerta');

    intervalTimer = setInterval(() => {
        tiempoRestante--;
        timerTexto.textContent = tiempoRestante;

        const porcentaje = (tiempoRestante / 30) * 100;
        timerProgreso.style.width = porcentaje + '%';

        if (tiempoRestante <= 10) {
            timerProgreso.classList.add('alerta');
            timerTexto.classList.add('alerta')
        }
        if (tiempoRestante === 0) {
            detenerTimer();
            manejarTimeout();
        }
    }, 1000);
}

function detenerTimer() {
    clearInterval(intervalTimer);
}

//funcion q maneja cuando se acaba el tiempo, obtiene el puntaje sin sumar puntos
async function manejarTimeout() {
    try {
        const response = await fetch(`${API_URL}/puntaje/${userId}`);
        const data = await response.json();

        mostrarResultado({
            correcto: false,
            puntosGanados: 0,
            puntajeTotal: data.puntajeTotal || 0,
            timeout: true
        });
    } catch (error) {

        mostrarResultado({
            correcto: false,
            puntosGanados: 0,
            puntajeTotal: 0,
            timeout: true
        });
    }
}

//manejo de las respuestas del usuario
btnVerdadero.addEventListener('click', () => {
    detenerTimer();
    validarRespuesta(true);
});

btnFalso.addEventListener('click', () => {
    detenerTimer();
    validarRespuesta(false);
});


//validar respuesta del usuario
async function validarRespuesta(respuestaUsuario) {
    try {
        const response = await fetch(`${API_URL}/respuesta`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                factoId: preguntaActual.factoId,
                textoMostrado: preguntaActual.texto,
                respuestaUsuario: respuestaUsuario,
                userId: userId
            })
        });

        const data = await response.json();
        mostrarResultado(data);

    } catch (error) {
        console.error('Error al validar respuesta:', error);
        alert('Error al validar respuesta. Intente de nuevo.');
    }
}


//funcion q muestra los resultados
function mostrarResultado(data) {
    if (data.timeout) {
        resultadoIcono.textContent = '⏱️';
        resultadoMensaje.textContent = '¡TIEMPO AGOTADO!';
        btnSalir.style.display = 'inline-block';
    } else if (data.correcto) {
        resultadoIcono.textContent = '✅';
        resultadoMensaje.textContent = '¡CORRECTO!';
        btnSalir.style.display = 'none';
    } else {
        resultadoIcono.textContent = '❌';
        resultadoMensaje.textContent = '¡INCORRECTO!';
        btnSalir.style.display = 'inline-block';
    }

    puntosGanados.textContent = data.puntosGanados;
    puntajeTotal.textContent = data.puntajeTotal;

    cambiarEstado(result)
}

//boton para pasar a la siguiente pregunta
btnSiguiente.addEventListener('click', async () => {
    await obtenerPregunta();
    cambiarEstado(playing);
    iniciarTimer();
});
//boton salir
btnSalir.addEventListener('click', () => {
    cambiarEstado(lobby)
});