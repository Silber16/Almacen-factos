const db = require('../config/db.js');

//buscar facto random en la bd
async function getRandomFact() {
    const query = `   
        SELECT id, content, quiz_content
        FROM facts
        WHERE quiz_content IS NOT NULL
        ORDER BY RANDOM()
        LIMIT 1;
    `;
        const result = await db.query(query);
        return result.rows;
}

//recibe el id del facto que se le mostro al usuario para validar la respuesta del usuario
async function getFactById(id) {
    const query = `
        SELECT content, quiz_content 
        FROM facts
        WHERE id = $1;
    `;
    const result = await db.query(query, [id]);
    return result.rows
}