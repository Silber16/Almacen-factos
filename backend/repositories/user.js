import db from "../config/db.js";

async function updateScore (score, userId) {
    const query = `UPDATE users SET score = score + ${score} WHERE id = ${userId}`;
    
    try {
        const result = await db.query(query);
        return result.rows;
    } catch (err) {
        console.error("Error al actualizar score: ", err);
        throw err;
    }
}

export { updateScore }