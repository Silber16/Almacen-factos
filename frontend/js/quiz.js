//elementos del DOM
const lobby = document.getElementById('lobby');
const playing = document.getElementById('playing');
const finalSummary = document.getElementById('final-summary'); 

const btnJugar = document.getElementById('btn-jugar');
const btnSurvival = document.getElementById('btn-survival'); 
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
const labelPuntosPartida = document.getElementById('label-puntos-partida');
const labelRanking = document.getElementById('label-ranking');

//elementos supervivencia
const survivalContainer = document.getElementById('survival-result-container');
const survivalStreakVal = document.getElementById('survival-final-streak');
const survivalExplanation = document.getElementById('survival-explanation');
const survivalCorrectVal = document.getElementById('survival-correct-val');
const recordBadge = document.getElementById('new-record-badge');
const sourceContainer = document.getElementById('survival-source-container');
const sourceLink = document.getElementById('survival-source-link');

// Elementos para la 3era caja de puntaje
const survivalPointsBox = document.getElementById('survival-points-box');
const survivalTotalPointsVal = document.getElementById('survival-total-points');

//elementos del modal
const modalFacto = document.getElementById('modal-facto');
const modalTexto = document.getElementById('modal-facto-texto');
const modalExplicacion = document.getElementById('modal-facto-explicacion');
const closeModalBtn = document.querySelector('.close-modal');

//config global
let preguntasArray = []; 
let preguntasVistas = [];
let indicePreguntaActual = 0;
let puntajeAcumuladoPartida = 0; 
let historialResultados = []; 

let totalPreguntasRespondidasHistorico = parseInt(localStorage.getItem('total_preguntas_respondidas') || '0');
let esPreguntaBonus = false; 
let tiempoRestante = 30;
let intervalTimer = null;

//modo survival
let modoJuego = 'clasico';
let rachaActual = 0;
let preguntasVistasSupervivencia = [];

//funciones de navegaciomn
function cambiarEstado(estadoActivo) {
    [lobby, playing, finalSummary].forEach(s => s.classList.remove('active'));
    estadoActivo.classList.add('active');
    
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
    if(!timerTexto || !timerProgreso) return;
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
async function comenzarJuego(modo = 'clasico') {
    modoJuego = modo;
    const btnActivo = (modo === 'survival') ? btnSurvival : btnJugar;
    const btnOriginalText = btnActivo.innerHTML;
    
    //cambio de pantalla al toque
    cambiarEstado(playing);
    preguntaTexto.textContent = "⏳ Buscando factos...";
    detenerTimer();

    btnActivo.innerHTML = '⌛ Cargando...';
    btnActivo.disabled = true;

    //limpieza de UI de resultados
    if (survivalContainer) survivalContainer.style.display = 'none';
    if (survivalPointsBox) survivalPointsBox.style.display = 'none'; 
    const tablaResumen = document.querySelector('.table-responsive');
    if (tablaResumen) tablaResumen.style.display = 'none';

    try {
        const token = localStorage.getItem('token');
        indicePreguntaActual = 0;
        puntajeAcumuladoPartida = 0;
        historialResultados = [];

        if (modo === 'survival') {
            rachaActual = 0;
            preguntasVistasSupervivencia = [];
            if(currentQNum) currentQNum.parentElement.style.visibility = 'hidden'; 

            const res = await fetch(`${import.meta.env.VITE_BACKEND_URI}/api/quiz/survival/check`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ rachaActual: 0, excludeIds: [] }) 
            });
            const data = await res.json();
            preguntasArray = [data.siguientePregunta];
        } 
        else {
            if(currentQNum) currentQNum.parentElement.style.visibility = 'visible';
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URI}/api/quiz/start`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ excludeIds: preguntasVistas })
            });
            
            if (!res.ok) throw new Error('Error al obtener preguntas');
            preguntasArray = await res.json();
            preguntasArray.forEach(p => { if (!preguntasVistas.includes(p.id)) preguntasVistas.push(p.id); });
        }

        cargarPregunta();

    } catch (error) {
        console.error("Error al iniciar:", error);
        alert("Error al conectar con el servidor.");
        cambiarEstado(lobby);
    } finally {
        btnActivo.innerHTML = btnOriginalText;
        btnActivo.disabled = false;
    }
}

function cargarPregunta() {
    resetearBotones();
    const data = preguntasArray[indicePreguntaActual];
    
    if (!data) return;

    const card = document.querySelector('.pregunta-card');
    card.classList.remove('bonus-active');
    const oldBadge = document.querySelector('.bonus-badge');
    if(oldBadge) oldBadge.remove();

    if (modoJuego === 'clasico') {
        const numeroReal = totalPreguntasRespondidasHistorico + 1;
        esPreguntaBonus = (numeroReal % 15 === 0);
        if (esPreguntaBonus) {
            card.classList.add('bonus-active');
            const badge = document.createElement('div');
            badge.className = 'bonus-badge';
            badge.innerHTML = '<i class="fa-solid fa-star"></i> BONUS X2 (6 Pts)';
            card.appendChild(badge);
        }
    }

    preguntaTexto.textContent = data.question_text;
    if(currentQNum) currentQNum.textContent = indicePreguntaActual + 1;
    iniciarTimer();
}

async function procesarRespuesta(respuestaUsuario, esTimeout = false) {
    detenerTimer();
    const preguntaActual = preguntasArray[indicePreguntaActual];
    btnVerdadero.disabled = true;
    btnFalso.disabled = true;

    if (modoJuego === 'survival') {
        await manejarRespuestaSurvival(respuestaUsuario, esTimeout, preguntaActual.id);
    } else {
        await manejarRespuestaClasico(respuestaUsuario, esTimeout, preguntaActual);
    }
}

async function manejarRespuestaSurvival(respuestaUsuario, esTimeout, questionId) {
    try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URI}/api/quiz/survival/check`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ 
                questionId, 
                answer: esTimeout ? null : respuestaUsuario,
                rachaActual: rachaActual,
                excludeIds: preguntasVistasSupervivencia
            })
        });

        const data = await res.json();

        if (data.status === 'sigue') {
            mostrarFeedbackVisual(true, false);
            rachaActual = data.nuevaRacha;
            puntajeAcumuladoPartida += data.puntosGanados;
            preguntasVistasSupervivencia.push(questionId);
            preguntasArray = [data.siguientePregunta];
            indicePreguntaActual = 0; 
            setTimeout(() => cargarPregunta(), 1500);
        } else {
            mostrarFeedbackVisual(false, esTimeout);
            setTimeout(() => finalizarJuegoSurvival(data), 1500);
        }
    } catch (error) { 
        console.error("Error survival:", error); 
        alert("Error al conectar con el servidor.");
        cambiarEstado(lobby);
    }
}

async function manejarRespuestaClasico(respuestaUsuario, esTimeout, preguntaActual) {
    let esCorrecto = false;
    let explicacion = "Se acabó el tiempo.";
    let puntosGanados = 0;

    if (esTimeout) {
        mostrarFeedbackVisual(false, true);
    } else {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URI}/api/quiz/verify`, { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ questionId: preguntaActual.id, userAnswer: respuestaUsuario })
            });
            const data = await res.json();
            esCorrecto = data.correct;
            explicacion = data.explanation;
            if (esCorrecto) {
                puntosGanados = esPreguntaBonus ? 6 : 3;
                puntajeAcumuladoPartida += puntosGanados;
            }
            mostrarFeedbackVisual(esCorrecto, false);
        } catch (error) { console.error("Error validando:", error); }
    }

    totalPreguntasRespondidasHistorico++;
    localStorage.setItem('total_preguntas_respondidas', totalPreguntasRespondidasHistorico.toString());

    historialResultados.push({
        numero: indicePreguntaActual + 1,
        preguntaTexto: preguntaActual.question_text,
        explicacion,
        respuestaCorrecta: preguntaActual.correct_answer, 
        respuestaUsuario: esTimeout ? '⏰' : (respuestaUsuario ? 'VERDADERO' : 'FALSO'),
        fuenteUrl: preguntaActual.source || preguntaActual.font || '#', 
        puntos: puntosGanados,
        esCorrecto,
        esBonus: esPreguntaBonus
    });

    setTimeout(() => siguientePregunta(), 1500);
}

function siguientePregunta() {
    indicePreguntaActual++;
    if (indicePreguntaActual < preguntasArray.length) cargarPregunta();
    else finalizarJuego();
}

function mostrarFeedbackVisual(esCorrecto, esTimeout) {
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
        feedbackBigText.textContent = '¡INCORRECTO!';
        feedbackOverlay.classList.add('incorrecto');
    }
    feedbackOverlay.style.display = 'flex';
    setTimeout(() => { feedbackOverlay.style.display = 'none'; }, 1300);
}

function resetearBotones() {
    if(btnVerdadero) btnVerdadero.disabled = false;
    if(btnFalso) btnFalso.disabled = false;
}

//fin del juego clasico
async function finalizarJuego() {
    cambiarEstado(finalSummary);
    
    if(survivalPointsBox) survivalPointsBox.style.display = 'none';
    if(survivalContainer) survivalContainer.style.display = 'none';
    
    const tablaResumen = document.querySelector('.table-responsive');
    if (tablaResumen) tablaResumen.style.display = 'block';

    labelPuntosPartida.textContent = "Puntos Partida";
    labelRanking.textContent = "Tu Ranking Total";
    roundScoreDisplay.textContent = `+${puntajeAcumuladoPartida}`;
    
    let rankingTotal = "...";
    try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URI}/api/quiz/score`, { 
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ points: puntajeAcumuladoPartida })
        });
        const data = await res.json();
        rankingTotal = data.score.score || data.score; 
    } catch (e) { rankingTotal = "Error"; }
    
    totalRankingScoreDisplay.textContent = rankingTotal;
    summaryBody.innerHTML = '';
    historialResultados.forEach((item, idx) => {
        const row = document.createElement('tr');
        const colorUsuario = item.esCorrecto ? '#4CAF50' : '#F44336';
        row.innerHTML = `
            <td>#${item.numero}</td>
            <td><button class="btn-small btn-ver" onclick="abrirModal(${idx})">👁️ Ver</button></td>
            <td style="font-weight:bold; color: #fff;">${item.respuestaCorrecta ? 'VERDADERO' : 'FALSO'}</td>
            <td style="color: ${colorUsuario}; font-weight:bold;">${item.respuestaUsuario}</td>
            <td><a href="${item.fuenteUrl}" target="_blank" class="btn-fuente"><i class="fa-solid fa-arrow-up-right-from-square"></i></a></td>
            <td style="color: var(--naranja-principal); font-weight: bold;">+${item.puntos}</td>
        `;
        summaryBody.appendChild(row);
    });
}

//pantalla final SURVIVAL
function finalizarJuegoSurvival(data) {
    cambiarEstado(finalSummary);
    
    const tablaResumen = document.querySelector('.table-responsive');
    if (tablaResumen) tablaResumen.style.display = 'none';
    if (survivalContainer) survivalContainer.style.display = 'block';
    if (survivalPointsBox) survivalPointsBox.style.display = 'block';

    labelPuntosPartida.textContent = "Racha Final";
    labelRanking.textContent = "Mejor Racha";

    roundScoreDisplay.textContent = `${data.rachaFinal}`;
    totalRankingScoreDisplay.textContent = data.mejorRacha;
    if (survivalTotalPointsVal) survivalTotalPointsVal.textContent = `+${puntajeAcumuladoPartida}`;

    if (survivalStreakVal) survivalStreakVal.textContent = data.rachaFinal;
    if (survivalExplanation) survivalExplanation.textContent = `💡 ${data.explicacion}`;
    if (survivalCorrectVal) survivalCorrectVal.textContent = data.respuestaCorrecta ? 'VERDADERO' : 'FALSO';
    if (recordBadge) recordBadge.style.display = data.esNuevoRecord ? 'block' : 'none';

    if (data.fuenteUrl && data.fuenteUrl !== '#' && data.fuenteUrl !== 'null') {
        sourceLink.href = data.fuenteUrl;
        sourceContainer.style.display = 'block';
    } else {
        sourceContainer.style.display = 'none';
    }
}

function abrirModal(index) {
    const datos = historialResultados[index];
    modalTexto.textContent = datos.preguntaTexto;
    modalExplicacion.textContent = datos.explicacion ? `💡 "${datos.explicacion}"` : 'Sin explicación disponible.';
    modalFacto.style.display = 'flex';
}

if(closeModalBtn) closeModalBtn.onclick = () => { modalFacto.style.display = 'none'; }
window.abrirModal = abrirModal;

//event listeners
if(btnJugar) btnJugar.onclick = () => comenzarJuego('clasico');
if(btnSurvival) btnSurvival.onclick = () => comenzarJuego('survival');
if(btnReintentar) btnReintentar.onclick = () => comenzarJuego(modoJuego);
if(btnVerdadero) btnVerdadero.onclick = () => procesarRespuesta(true);
if(btnFalso) btnFalso.onclick = () => procesarRespuesta(false);
if(btnSalirSummary) btnSalirSummary.onclick = () => { cambiarEstado(lobby); };

document.addEventListener('DOMContentLoaded', () => {
    const navBtnHome = document.getElementById('btn-quiz');
    if(navBtnHome) navBtnHome.classList.toggle('nav-btn-active');
});