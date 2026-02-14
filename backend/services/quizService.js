import quizRepository from '../repositories/quizRepository.js';

//trae 5 preguntas respetando la lista para que no se repitan 
async function generateQuiz(excludeIds = []) {
    const LIMIT = 5;

    try {
        //le pasamos al repo la lista de ids q ya le salieron al usuario para que las excluya
        let questions = await quizRepository.getRandomQuestions(LIMIT, excludeIds);
        
        //cuando el usuario jugo mucho, se completa con preguntas que ya salieron
        if (questions.length < LIMIT) {
            const faltantes = LIMIT - questions.length;

            const relleno = await quizRepository.getRandomQuestions(faltantes, []);
            
            //se unen las q no salieron con las que ya si
            questions = [...questions, ...relleno];
        }

        //se deveulve el array de 5 preguntas al controller
        return questions;

    } catch (err) {
        throw err;
    }
}

//se valida la respuesta omparando con lo guardado en quiz_questions
async function validarYActualizarPuntos(questionId, respuestaUsuario, userId) {
    if (!questionId || isNaN(Number(questionId))) throw new Error("ID de pregunta no válido.");
    if (!userId || isNaN(Number(userId))) throw new Error("ID de usuario no válido.");

    try {
        //se busca la correcta en la bd
        const datosPregunta = await quizRepository.getQuestionAnswer(questionId);

        if (!datosPregunta) {
            throw new Error("Pregunta no encontrada.");
        }

        const respuestaCorrecta = datosPregunta.correct_answer;
        const explicacion = datosPregunta.explanation;

        //logica de comparacion
        const esCorrecto = String(respuestaUsuario).trim().toLowerCase() === String(respuestaCorrecta).trim().toLowerCase();

        let puntosGanados = 0;
        if (esCorrecto) {
            puntosGanados = 10;
            await quizRepository.updateUserPoints(userId, puntosGanados);
        }

        //obtener puntaje actualizado
        const userPoints = await quizRepository.getUserPoints(userId);
        const puntajeTotal = userPoints ? userPoints.score : 0; 

        return {
            correcto: esCorrecto,
            puntosGanados,
            puntajeTotal,
            respuestaCorrecta, 
            explicacion
        };

    } catch(err) {
        throw err;
    }
}

//survival
async function processSurvivalAnswer(userId, questionId, respuestaUsuario, rachaActual, excludeIds = []) {
    try {
        if (!questionId) {
            const nextQuestionArray = await quizRepository.getRandomQuestions(1, excludeIds);
            return {
                status: 'sigue',
                siguientePregunta: nextQuestionArray[0],
                nuevaRacha: 0,
                puntosGanados: 0
            };
        }

        //se buscan los datos de la pregunta para validar
        const datosPregunta = await quizRepository.getQuestionAnswer(questionId);
        if (!datosPregunta) throw new Error("Pregunta no encontrada.");

        const esCorrecto = String(respuestaUsuario).trim().toLowerCase() === String(datosPregunta.correct_answer).trim().toLowerCase();

        //si el usuario respondio bien se sigue
        if (esCorrecto) {
            const nuevaRacha = rachaActual + 1;
            
            //puntos 3 de base + 10 cada 3 preguntas
            let puntosAGanar = 3;
            if (nuevaRacha % 3 === 0) {
                puntosAGanar += 10;
            }

            //se metene los puntos en el score global
            await quizRepository.updateUserPoints(userId, puntosAGanar);

            //se busca la sigueinte pregunta excluyendo las q ya salieron
            const nextQuestionArray = await quizRepository.getRandomQuestions(1, excludeIds);
            const siguientePregunta = nextQuestionArray[0] || null;

            return {
                status: 'sigue',
                correcto: true,
                nuevaRacha,
                puntosGanados: puntosAGanar,
                siguientePregunta
            };
        } 

        //cuando el user pifia
        else {
            //se busca el record actual en la bd
            const recordData = await quizRepository.getSurvivalRecord(userId);
            const recordAnterior = recordData ? recordData.max_survival_record : 0;
            
            let esNuevoRecord = false;
            let puntosBonusRecord = 0;

            //si mejoro el record
            if (rachaActual > recordAnterior) {
                esNuevoRecord = true;
                puntosBonusRecord = 10;
                //se actualiza
                await quizRepository.updateSurvivalRecord(userId, rachaActual);
                //premio por nuevo record
                await quizRepository.updateUserPoints(userId, puntosBonusRecord);
            }

            //se guarda el intento en quiz_attempts
            await quizRepository.createSurvivalAttempt(userId, rachaActual);

            return {
                status: 'game_over',
                correcto: false,
                rachaFinal: rachaActual,
                mejorRacha: esNuevoRecord ? rachaActual : recordAnterior,
                esNuevoRecord,
                puntosBonusRecord,
                explicacion: datosPregunta.explanation,
                respuestaCorrecta: datosPregunta.correct_answer,
                fuenteUrl: datosPregunta.source || datosPregunta.font || '#'
            };
        }

    } catch (err) {
        console.error("Error en el servicio de supervivencia:", err);
        throw err;
    }
}

export default {
    generateQuiz,
    validarYActualizarPuntos,
    processSurvivalAnswer
};