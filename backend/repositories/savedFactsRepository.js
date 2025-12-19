import { query } from '../db.js';

//guardar factura
async function saveFact(userId, factId) {
    const text = `
        INSERT INTO saved_facts (user_id, fact_id)
        VALUES ($1, $2)
        ON CONFLICT (user_id, fact_id) DO NOTHING`;
    await query(text, [userId, factId]);
}

//eliminar factura
async function unsaveFact(userId, factId) {
    const text = `DELETE FROM saved_facts WHERE user_id = $1 AND fact_id = $2`;
    await query(text, [userId, factId]);
}

//verificar guardado
async function isFactSaved(userId, factId) {
    const text = `SELECT 1 FROM saved_facts WHERE user_id = $1 AND fact_id = $2`;
    const result = await query(text, [userId, factId]);
    return result.rowCount > 0;
}

//obtener los factos guardados
async function getSavedFactsByUser(userId) {
    const text = `
        SELECT f.*, sf.saved_at 
        FROM facts f
        JOIN saved_facts sf ON f.id = sf.fact_id
        WHERE sf.user_id = $1
        ORDER BY sf.saved_at DESC
    `;
    const result = await query(text, [userId]);
    return result.rows;
}

export { saveFact, 
        unsaveFact, 
        isFactSaved, 
        getSavedFactsByUser };