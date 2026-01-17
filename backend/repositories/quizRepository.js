import db from '../config/db.js';

//guarda la pregunta generada por la ia
async function createQuizQuestion(factId, questionText, correctAnswer, explanation, difficulty) {
    const query = `
    INSERT INTO quiz_questions (fact_id, question_text, correct_answer, explanation, difficulty)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
    `;
    const diff = difficulty || 'medium';

    try {
        const result = await db.query(query, [factId, questionText, correctAnswer, explanation, diff]);
        return result.rows[0];
    } catch (error) {
        console.error("Error al guardar pregunta de quiz:", error);
        throw error;
    }
}

//traeuna sola pregunta random para el quiz
async function getRandomQuestion() {
    const query = `
    SELECT 
        qq.id, 
        qq.question_text, 
        qq.correct_answer, 
        qq.explanation, 
        qq.difficulty, 
        qq.fact_id,
        f.font,
        f.iconurl as image -- Asumiendo que tenés la imagen en facts
    FROM quiz_questions qq
    JOIN facts f ON qq.fact_id = f.id
    ORDER BY RANDOM()
    LIMIT 1;
    `;
    
    try {
        const result = await db.query(query);
        return result.rows[0];
    } catch (error) {
        console.error("Error al obtener pregunta random:", error);
        throw error;
    }
}

//trae preguntas random para el quiz (Versión lista/plural)
async function getRandomQuestions(limit = 5) {
    const query = `
    SELECT qq.id, qq.question_text, qq.difficulty, f.font
    FROM quiz_questions qq
    JOIN facts f ON qq.fact_id = f.id
    ORDER BY RANDOM()
    LIMIT $1;
    `;
    const result = await db.query(query, [limit]);
    return result.rows;
}

//valida la respuesta
async function getQuestionAnswer(id) {
    const query = `
    SELECT correct_answer, explanation 
        FROM quiz_questions
        WHERE id = $1;
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
}

//suma puntos a la columna score de users en caso de que el usuario haya contestado correctamente
async function updateUserPoints(userId, points) {
    const query = `
    UPDATE users
    SET score = score + $1 
    WHERE id = $2
    RETURNING score;
    `;
    const result = await db.query(query, [points, userId]);
    return result.rows[0];
}

//una vez que termine el juego se le va a mostrar al usuario su puntaje total
async function getUserPoints(userId) {
    const query = `
        SELECT score 
        FROM users 
        WHERE id = $1;
        `;
    const result = await db.query(query, [userId]);
    return result.rows[0];
}


export default {
    createQuizQuestion,
    getRandomQuestion,
    getRandomQuestions,
    getQuestionAnswer,
    updateUserPoints,
    getUserPoints
};