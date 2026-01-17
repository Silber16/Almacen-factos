//elementos del DOM
const lobby = document.getElementById('lobby');
const playing = document.getElementById('playing');
const finalSummary = document.getElementById('final-summary'); 

const btnJugar = document.getElementById('btn-jugar');
const btnVerdadero = document.getElementById('btn-verdadero');
const btnFalso = document.getElementById('btn-falso');
const navContainer = document.getElementById('nav-btns-container');

//btnes del summary
const btnReintentar = document.getElementById('btn-reintentar');
const btnSalirSummary = document.getElementById('btn-salir-summary');

const preguntaTexto = document.getElementById('pregunta-texto');
const currentQNum = document.getElementById('current-q-num');
const feedbackFlotante = document.getElementById('feedback-flotante');

const timerTexto = document.getElementById('timer-texto');
const timerProgreso = document.getElementById('timer-progreso');

//animaciones de respuesta
const feedbackOverlay = document.getElementById('feedback-overlay-container');
const feedbackBigIcon = document.getElementById('feedback-big-icon');
const feedbackBigText = document.getElementById('feedback-big-text');

//elementos de la tabla y puntajes
const roundScoreDisplay = document.getElementById('round-score');
const totalRankingScoreDisplay = document.getElementById('total-ranking-score');
const summaryBody = document.getElementById('summary-body');

//elementos del modal
const modalFacto = document.getElementById('modal-facto');
const modalTexto = document.getElementById('modal-facto-texto');
const modalExplicacion = document.getElementById('modal-facto-explicacion');
const closeModalBtn = document.querySelector('.close-modal');

//config global
const API_URL = 'http://localhost:3000/api/quiz';
let preguntasArray = []; 
let indicePreguntaActual = 0;
let puntajeAcumuladoPartida = 0; 
let historialResultados = []; 

//aca se lee el historial para ver si toca bonus
let totalPreguntasRespondidasHistorico = parseInt(localStorage.getItem('total_preguntas_respondidas') || '0');
let esPreguntaBonus = false; 
let tiempoRestante = 30;
let intervalTimer = null; 


//funciones de navegaciomn
function cambiarEstado(estadoActivo) {
    [lobby, playing, finalSummary].forEach(s => s.classList.remove('active'));
    estadoActivo.classList.add('active');
    
    //visibilidad del navbar
    if (estadoActivo === playing) {
        if(navContainer) navContainer.style.display = 'none';
    } else {
        if(navContainer) navContainer.style.display = 'block'; 
    }
}

//timer
function iniciarTimer() {
    detenerTimer();
    tiempoRestante = 30;
    actualizarVistaTimer();

    intervalTimer = setInterval(() => {
        tiempoRestante--;
        actualizarVistaTimer();

        if (tiempoRestante <= 0) {
            detenerTimer();
            //timeout cuenta como incorrecto
            procesarRespuesta(null, true); 
        }
    }, 1000);
}

function detenerTimer() {
    if (intervalTimer) {
        clearInterval(intervalTimer);
        intervalTimer = null;
    }
}

function actualizarVistaTimer() {
    timerTexto.textContent = tiempoRestante;
    timerProgreso.style.width = (tiempoRestante / 30 * 100) + '%';

    if (tiempoRestante <= 10) {
        timerProgreso.classList.add('alerta');
        timerTexto.classList.add('alerta');
    } else {
        timerProgreso.classList.remove('alerta');
        timerTexto.classList.remove('alerta');
    }
}

//inicio del juego
async function comenzarJuego() {
    const btnOriginalText = btnJugar.innerHTML;
    btnJugar.innerHTML = '⌛ Cargando...';
    btnJugar.disabled = true;

    try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/start`, { 
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!res.ok) throw new Error('Error al obtener preguntas');

        preguntasArray = await res.json();
        
        //reseteo de variables de partida
        indicePreguntaActual = 0;
        puntajeAcumuladoPartida = 0;
        historialResultados = [];

        cargarPregunta();
        cambiarEstado(playing);

    } catch (error) {
        console.error(error);
        alert("Error al iniciar. Revisá tu conexión o que el Backend esté corriendo.");
    } finally {
        btnJugar.innerHTML = btnOriginalText;
        btnJugar.disabled = false;
    }
}

//carga pregunta individual
function cargarPregunta() {
    resetearBotones();
    feedbackFlotante.style.display = 'none';
    
    //se limpian estilos de bonus
    const card = document.querySelector('.pregunta-card');
    card.classList.remove('bonus-active');
    const oldBadge = document.querySelector('.bonus-badge');
    if(oldBadge) oldBadge.remove();

    //datos de la pregunta actual
    const data = preguntasArray[indicePreguntaActual];
    
    //logica bonus
    const numeroReal = totalPreguntasRespondidasHistorico + 1;
    esPreguntaBonus = (numeroReal % 15 === 0);

    if (esPreguntaBonus) {
        card.classList.add('bonus-active');
        
        //se crea la etiqueta visual
        const badge = document.createElement('div');
        badge.className = 'bonus-badge';
        badge.innerHTML = '<i class="fa-solid fa-star"></i> BONUS X2 (6 Pts)';
        card.appendChild(badge);
    }

    preguntaTexto.textContent = data.question_text;
    if(currentQNum) currentQNum.textContent = indicePreguntaActual + 1;

    iniciarTimer();
}


async function procesarRespuesta(respuestaUsuario, esTimeout = false) {
    detenerTimer();
    const preguntaActual = preguntasArray[indicePreguntaActual];
    
    //se bloquean los botones
    btnVerdadero.disabled = true;
    btnFalso.disabled = true;

    let esCorrecto = false;
    let explicacion = "Se acabó el tiempo.";
    let puntosGanados = 0;

    if (esTimeout) {
        mostrarFeedbackVisual(false, true);
    } else {
        try {
            const token = localStorage.getItem('token');
            //se valida con el back
            const res = await fetch(`${API_URL}/verify`, { 
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ 
                    questionId: preguntaActual.id, 
                    userAnswer: respuestaUsuario 
                })
            });

            const data = await res.json();
            esCorrecto = data.correct;
            explicacion = data.explanation;

            if (esCorrecto) {
                //3 normal, 6 si es bonus
                puntosGanados = esPreguntaBonus ? 6 : 3;
                puntajeAcumuladoPartida += puntosGanados;
            }

            mostrarFeedbackVisual(esCorrecto, false);

        } catch (error) {
            console.error("Error validando:", error);
        }
    }

    //actualiza contador historico
    totalPreguntasRespondidasHistorico++;
    localStorage.setItem('total_preguntas_respondidas', totalPreguntasRespondidasHistorico.toString());

    //se guardan los datos para la tabla final
    historialResultados.push({
        numero: indicePreguntaActual + 1,
        preguntaTexto: preguntaActual.question_text,
        explicacion: explicacion,
        respuestaCorrecta: preguntaActual.correct_answer, 
        respuestaUsuario: esTimeout ? '⏰' : (respuestaUsuario ? 'VERDADERO' : 'FALSO'),
        // AHORA PROBAMOS AMBOS CAMPOS POR SI ACASO:
        fuenteUrl: preguntaActual.source || preguntaActual.font || '#', 
        puntos: puntosGanados,
        esCorrecto: esCorrecto,
        esBonus: esPreguntaBonus
    });
    setTimeout(() => {
        siguientePregunta();
    }, 1500);
}

function siguientePregunta() {
    indicePreguntaActual++;
    
    if (indicePreguntaActual < preguntasArray.length) {
        cargarPregunta();
    } else {
        finalizarJuego();
    }
}

function mostrarFeedbackVisual(esCorrecto, esTimeout) {
    //se limpian colores viejos
    feedbackOverlay.classList.remove('correcto', 'incorrecto');
    
    if (esTimeout) {
        feedbackBigIcon.className = 'fa-solid fa-hourglass-end';
        feedbackBigText.textContent = '¡TIEMPO!';
        feedbackOverlay.classList.add('incorrecto');
    } else if (esCorrecto) {
        feedbackBigIcon.className = 'fa-solid fa-circle-check';
        feedbackBigText.textContent = '¡CORRECTO!';
        feedbackOverlay.classList.add('correcto');
    } else {
        feedbackBigIcon.className = 'fa-solid fa-circle-xmark';
        feedbackBigText.textContent = 'INCORRECTO';
        feedbackOverlay.classList.add('incorrecto');
    }

    //se muestra el cartel
    feedbackOverlay.style.display = 'flex';

    //se oculta
    setTimeout(() => {
        feedbackOverlay.style.display = 'none';
        feedbackOverlay.classList.remove('correcto', 'incorrecto');
    }, 1300);
}

function resetearBotones() {
    btnVerdadero.disabled = false;
    btnFalso.disabled = false;
    btnVerdadero.style.opacity = "1";
    btnFalso.style.opacity = "1";
}

//fin del juego y generacion de tabla
async function finalizarJuego() {
    cambiarEstado(finalSummary);
    
    //puntaje partida
    roundScoreDisplay.textContent = `+${puntajeAcumuladoPartida}`;

    //se envia el puntaje al backend
    let rankingTotal = "...";
    try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/score`, { 
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ points: puntajeAcumuladoPartida })
        });
        const data = await res.json();
        rankingTotal = data.score.score || data.score; 
    } catch (error) {
        console.error("Error guardando puntaje:", error);
        rankingTotal = "Error";
    }
    
    totalRankingScoreDisplay.textContent = rankingTotal;

    //generacion de tabla
    summaryBody.innerHTML = '';
    
    historialResultados.forEach((item) => {
        const row = document.createElement('tr');
        
        const textoCorrecta = item.respuestaCorrecta ? 'VERDADERO' : 'FALSO';
        const colorUsuario = item.esCorrecto ? '#4CAF50' : '#F44336';
        
        //si fue bonus se agrega una estrellita
        const puntosDisplay = item.esBonus 
            ? `<span style="color: #FFD700;">+${item.puntos} 🌟</span>` 
            : `+${item.puntos}`;

        // LÓGICA DEL BOTÓN DE FUENTE (Updated)
        let celdaFuente = '<span style="opacity:0.5">-</span>';
        // Chequeamos que no sea null, ni '#', ni texto vacío
        if (item.fuenteUrl && item.fuenteUrl !== '#' && item.fuenteUrl !== 'null' && item.fuenteUrl.trim() !== '') {
            celdaFuente = `
                <a href="${item.fuenteUrl}" target="_blank" class="btn-fuente" title="Ir a la fuente">
                    <i class="fa-solid fa-arrow-up-right-from-square"></i>
                </a>`;
        }

        row.innerHTML = `
            <td>#${item.numero}</td>
            <td>
                <button class="btn-small btn-ver" onclick="abrirModal(${item.numero - 1})">
                    👁️ Ver
                </button>
            </td>
            <td style="font-weight:bold; color: #fff;">${textoCorrecta}</td>
            <td style="color: ${colorUsuario}; font-weight:bold;">${item.respuestaUsuario}</td>
            <td>${celdaFuente}</td>
            <td style="color: var(--naranja-principal); font-weight: bold;">${puntosDisplay}</td>
        `;
        summaryBody.appendChild(row);
    });
}

//logica del modal
function abrirModal(index) {
    const datos = historialResultados[index];
    modalTexto.textContent = datos.preguntaTexto;
    modalExplicacion.textContent = datos.explicacion ? `💡 "${datos.explicacion}"` : 'Sin explicación disponible.';
    modalFacto.style.display = 'flex';
}

closeModalBtn.onclick = () => {
    modalFacto.style.display = 'none';
}

window.onclick = (event) => {
    if (event.target == modalFacto) {
        modalFacto.style.display = 'none';
    }
}
window.abrirModal = abrirModal;

//event listeners
btnJugar.onclick = comenzarJuego;
btnReintentar.onclick = comenzarJuego;

btnVerdadero.onclick = () => procesarRespuesta(true);
btnFalso.onclick = () => procesarRespuesta(false);

btnSalirSummary.onclick = () => {
    cambiarEstado(lobby);
};

document.addEventListener('DOMContentLoaded', () => {
    const navBtnHome = document.getElementById('btn-quiz');
    if(navBtnHome) navBtnHome.classList.toggle('nav-btn-active');
});