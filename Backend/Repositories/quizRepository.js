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
        return result.rows[0];
}