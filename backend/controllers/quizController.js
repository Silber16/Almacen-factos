import * as iaService from "../services/Ia.js";
import db from "../config/db.js";

//obtener y guardar la pregunta
const obtenerPregunta = async (req, res) => {
    try {
        // Obtenemos id, contenido y fuente del facto original
        const result = await db.query("SELECT id, content, font FROM facts ORDER BY RANDOM() LIMIT 1");
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'No hay factos en la base de datos.' });
        }

        const factoBase = result.rows[0];
        const triviaIA = await iaService.getQuizQuestion(factoBase.content);

        // Persistimos la trivia en la tabla quiz_questions
        const insertQuery = `
            INSERT INTO quiz_questions (fact_id, question_text, correct_answer, explanation)
            VALUES ($1, $2, $3, $4)
            RETURNING id;
        `;
        
        const nuevoQuiz = await db.query(insertQuery, [
            factoBase.id, 
            triviaIA.question, 
            triviaIA.answer, 
            triviaIA.explanation
        ]);

        res.json({
            quizId: nuevoQuiz.rows[0].id,
            question: triviaIA.question,
            fuente: factoBase.font,
            factoOriginal: factoBase.content // <--- Texto original para el recordatorio
        });

    } catch (error) {
        console.error('Error al obtener pregunta de IA:', error);
        res.status(500).json({ error: 'Error al generar la entidad Quiz.' });
    }
};

//validar respuesta
const validarRespuesta = async (req, res) => {
    try {
        const userId = req.user.id; 
        const { quizId, respuestaUsuario } = req.body;

        const quizResult = await db.query("SELECT correct_answer, explanation FROM quiz_questions WHERE id = $1", [quizId]);

        if (quizResult.rows.length === 0) {
            return res.status(404).json({ error: "Pregunta no encontrada." });
        }

        const { correct_answer, explanation } = quizResult.rows[0];
        const esCorrecto = (respuestaUsuario === correct_answer);

        let nuevoPuntaje = 0;

        if (esCorrecto) {
            // Sumamos 10 puntos al usuario
            const updateResult = await db.query(
                "UPDATE users SET score = score + 10 WHERE id = $1 RETURNING score",
                [userId]
            );
            nuevoPuntaje = updateResult.rows[0].score;
        } else {
            const scoreResult = await db.query("SELECT score FROM users WHERE id = $1", [userId]);
            nuevoPuntaje = scoreResult.rows[0]?.score || 0;
        }

        res.json({ 
            correcto: esCorrecto, 
            mensaje: explanation, 
            nuevoPuntaje: nuevoPuntaje,
            respuestaCorrecta: correct_answer 
        });

    } catch (error) {
        console.error('Error al validar respuesta:', error);
        res.status(500).json({ error: 'Error del servidor' });
    }
};

const obtenerPuntaje = async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await db.query("SELECT score FROM users WHERE id = $1", [userId]);
        res.json({ puntajeTotal: result.rows[0]?.score || 0 });
    } catch (error) {
        res.status(500).json({ error: 'Error del servidor' });
    }
};

export default { obtenerPregunta, validarRespuesta, obtenerPuntaje };