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

//trae una sola pregunta random para el quiz
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
        f.iconurl as image 
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

//trae preguntas random para el quiz
async function getRandomQuestions(limit = 5, excludeIds = []) {
    let query = `
    SELECT qq.id, qq.question_text, qq.difficulty, f.font
    FROM quiz_questions qq
    JOIN facts f ON qq.fact_id = f.id
    `;
    const params = [];

    //logica de filtrado para que no se repitan
    if (excludeIds.length > 0) {
        const placeholders = excludeIds.map((_, index) => `$${index + 1}`).join(', ');
        query += ` WHERE qq.id NOT IN (${placeholders})`;
        params.push(...excludeIds);
    }
    
    const limitParamIndex = params.length + 1;
    query += ` ORDER BY RANDOM() LIMIT $${limitParamIndex};`;
    params.push(limit);

    try {
        const result = await db.query(query, params);
        return result.rows;
    } catch (error) {
        console.error("Error al obtener preguntas:", error);
        throw error;
    }
}

//trae la pregunta
async function getQuestionAnswer(id) {
    const query = `
    SELECT qq.correct_answer, qq.explanation, f.font 
    FROM quiz_questions qq
    JOIN facts f ON qq.fact_id = f.id
    WHERE qq.id = $1;
    `;
    try {
        const result = await db.query(query, [id]);
        return result.rows[0];
    } catch (error) {
        console.error("Error en getQuestionAnswer:", error);
        throw error;
    }
}

//suma puntos a la columna score
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

//trae puntaje total
async function getUserPoints(userId) {
    const query = `
        SELECT score 
        FROM users 
        WHERE id = $1;
        `;
    const result = await db.query(query, [userId]);
    return result.rows[0];
}

//MODO SURVIVAL

//actualiza el record de racha maxima
async function updateSurvivalRecord(userId, newRecord) {
    const query = `
    UPDATE users
    SET max_survival_record = $1
    WHERE id = $2 AND max_survival_record < $1
    RETURNING max_survival_record;
    `;
    try {
        const result = await db.query(query, [newRecord, userId]);
        return result.rows[0];
    } catch (error) {
        console.error("Error al actualizar récord de supervivencia en DB:", error);
        throw error;
    }
}

//trae el record actual
async function getSurvivalRecord(userId) {
    const query = `
    SELECT max_survival_record 
    FROM users 
    WHERE id = $1;
    `;
    try {
        const result = await db.query(query, [userId]);
        return result.rows[0];
    } catch (error) {
        console.error("Error al obtener récord de supervivencia de DB:", error);
        throw error;
    }
}

//registra el intento en el historial
async function createSurvivalAttempt(userId, score) {
    const query = `
    INSERT INTO quiz_attempts (user_id, score, game_mode)
    VALUES ($1, $2, 'survival')
    RETURNING *;
    `;
    try {
        const result = await db.query(query, [userId, score]);
        return result.rows[0];
    } catch (error) {
        console.error("Error al registrar intento de racha en DB:", error);
        throw error;
    }
}

export default {
    createQuizQuestion,
    getRandomQuestion,
    getRandomQuestions,
    getQuestionAnswer,
    updateUserPoints,
    getUserPoints,
    updateSurvivalRecord,
    getSurvivalRecord,
    createSurvivalAttempt
};