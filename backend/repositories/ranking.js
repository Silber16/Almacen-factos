import db from "../config/db.js";
export const getranking = async() => {
        const query = `
        SELECT 
            u.id,
            u.username,
            u.score,
            COUNT(f.id) AS facts_count
        FROM users u
        LEFT JOIN facts f ON f.created_by = u.id
        GROUP BY u.id
        ORDER BY u.score DESC, facts_count DESC
        LIMIT 10
    `;
    const {rows} = await db.query(query);
    return rows;
};