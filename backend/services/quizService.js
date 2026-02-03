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
        const esCorrecto = respuestaUsuario.toString().trim().toLowerCase() === respuestaCorrecta.toString().trim().toLowerCase();

        let puntosGanados = 0;
        if (esCorrecto) {
            puntosGanados = 10;
            await quizRepository.updateUserPoints(userId, puntosGanados);
        }

        //obtener puntaje actualizado
        const userPoints = await quizRepository.getUserPoints(userId);
        const puntajeTotal = userPoints ? userPoints.score : 0; // Ajuste por si devuelve objeto o array

        return {
            correcto: esCorrecto,
            puntosGanados,
            puntajeTotal,
            respuestaCorrecta, //se la mandopara que el front muestre cual era
            explicacion
        };

    } catch(err) {
        throw err;
    }
}

export default {
    generateQuiz,
    validarYActualizarPuntos
};