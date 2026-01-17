import quizRepository from '../repositories/quizRepository.js';

// 1. TRAER PREGUNTA (Va a la tabla quiz_questions)
async function obtenerPreguntaRandom() {
    try {
        // Usamos la función que creamos recién en el repo
        const pregunta = await quizRepository.getRandomQuestion();
        
        if (!pregunta) {
            return null;
        }

        // Devolvemos el objeto limpio al frontend
        // NOTA: Si tu frontend espera "options", acá deberías mandarlas.
        // Como tu tabla quiz_questions parece ser de texto directo, mandamos eso.
        return {
            questionId: pregunta.id, // ID de la pregunta, no del facto
            questionText: pregunta.question_text, 
            difficulty: pregunta.difficulty,
            image: pregunta.image, // Viene del join con facts
            source: pregunta.font,
            // Si es multiple choice y tenés las opciones en la BD, van acá.
            // Si es Open Text (escribir respuesta), el front solo muestra la pregunta.
        };

    } catch (err) {
        throw err;
    }
}

// 2. VALIDAR RESPUESTA (Compara con lo guardado en quiz_questions)
async function validarYActualizarPuntos(questionId, respuestaUsuario, userId) {
    // Validaciones básicas
    if (!questionId || isNaN(Number(questionId))) throw new Error("ID de pregunta no válido.");
    if (!userId || isNaN(Number(userId))) throw new Error("ID de usuario no válido.");

    try {
        // Buscamos la respuesta CORRECTA en la base de datos
        const datosPregunta = await quizRepository.getQuestionAnswer(questionId);

        if (!datosPregunta) {
            throw new Error("Pregunta no encontrada.");
        }

        const respuestaCorrecta = datosPregunta.correct_answer;
        const explicacion = datosPregunta.explanation;

        // Lógica de comparación (ignorando mayúsculas/minúsculas si es texto)
        // Si es multiple choice, comparamos exacto.
        const esCorrecto = respuestaUsuario.toString().trim().toLowerCase() === respuestaCorrecta.toString().trim().toLowerCase();

        let puntosGanados = 0;
        if (esCorrecto) {
            puntosGanados = 10; // O podés variar según dificultad
            await quizRepository.updateUserPoints(userId, puntosGanados);
        }

        // Obtener puntaje actualizado
        const userPoints = await quizRepository.getUserPoints(userId);
        const puntajeTotal = userPoints ? userPoints.score : 0; // Ajuste por si devuelve objeto o array

        return {
            correcto: esCorrecto,
            puntosGanados,
            puntajeTotal,
            respuestaCorrecta, // Se la mandamos para que el front muestre cuál era
            explicacion // Y la explicación de la IA
        };

    } catch(err) {
        throw err;
    }
}

export default {
    obtenerPreguntaRandom,
    validarYActualizarPuntos
};