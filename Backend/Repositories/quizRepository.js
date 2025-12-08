const db = require('../config/db.js');

//buscar facto random en la bd
async function getRandomFact() {
    const query = `   
        SELECT id, content, modified_content
        FROM facts
        WHERE modified_content IS NOT NULL
        ORDER BY RANDOM()
        LIMIT 1;
    `;
        const result = await db.query(query);
        return result.rows[0];
}

//recibe el id del facto que se le mostro al usuario para validar la respuesta del usuario
async function getFactById(id) {
    const query = `
        SELECT content, modified_content 
        FROM facts
        WHERE id = $1;
    `;
    const result = await db.query(query, [id]);
    return result.rows
}

//suma puntos a la columna score de users en caso de que el usuario haya contestado correctamente
async function updateUserPoints(userId, points) {
    const query = `
    UPDATE users
    SET score = score + $1 
    WHERE id = $2;
    `;
    await db.query(query, [points, userId]);
}

//una vez que termine el juego se le va a mostrar al usuario su puntaje total
async function getUserPoints(userId) {
    const query = `
        SELECT score 
        FROM users 
        WHERE id = $1;
        `;
    const result = await db.query(query, [userId]);
    return result.rows;
}


module.exports =  {
    getRandomFact,
    getFactById,
    updateUserPoints,
    getUserPoints
};