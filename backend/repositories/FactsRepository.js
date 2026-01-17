import db from "../config/db.js";

async function getFactsAll () {
    const query = `
        SELECT
            f.id,
            f.title,
            f.content,
            f.font,
            f.category,
            f.created_by,
            u.username,
            u.id as user_id,
            f.ia_response,
            f.ia_responseverdict
        FROM facts f
        LEFT JOIN users u ON f.created_by = u.id
        ORDER BY id DESC
        `;
    
    try {
        const result = await db.query(query);
        return result.rows;
    } catch (err) {
        console.error("Error al obtener facts: ", err);
        throw err;
    }
}

async function getFactsByUserId (userId) {
    const query = `SELECT * FROM facts WHERE created_by = $1`;

    try {
        const result = await db.query(query, [userId]);

        return result.rows;
    } catch (err) {
        console.error("Error al obtener facts: ", err);
        throw err;
    }
}

async function getFactsCategory (category) {
    const query = `SELECT * FROM facts WHERE category = $1`;
    
    try {
        const result = await db.query(query, [category]);
        return result.rows;
    } catch (err) {
        console.error("Error al obtener facts: ", err);
        throw err;
    }
}

async function getFactById (id) {
    const query = `SELECT * FROM facts WHERE id = $1`;
    
    try {
        const result = await db.query(query, [id]);

        return result.rows;
    } catch (err) {
        console.error("Error al obtener fact:", err);
        throw err;
    }
}

async function createFact (fact) {
    console.log(fact)
    const query = `
        INSERT INTO 
            facts(title, content, font, created_by, category, ia_response, ia_responseverdict)
        VALUES 
            ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *;
    `;
    const values = [
        fact.title, 
        fact.content, 
        fact.font, 
        fact.createdBy,
        fact.category, 
        fact.iaResponse,
        fact.iaVerdict
    ];

    try {
        const result = await db.query(query, values);
        return result.rows[0]; 

    } catch (error) {
        console.error("Error al crear fact:", error);
        return null;
    }
}

async function addToRepo (factId, userId) {

    const query = `
        INSERT INTO 
            saved_facts(user_id, fact_id)
        VALUES 
            ($1, $2)
        ON CONFLICT (user_id, fact_id) DO NOTHING
        RETURNING fact_id AS "factId", user_id AS "userId"
    `;
    const values = [
        userId,
        factId
    ];

    try {
        const res = await db.query(query, values);
        return res.rowCount > 0;
        
    } catch (error) {
        console.error("Error al guardar fact:", error);
        return false;
    }
}

async function updateFact (factObj) {
    const query = `
        UPDATE Facts
        SET 
            title = $1, 
            text = $2, 
            font = $3, 
            category = $4,
            contenido_quiz = $5
        WHERE 
            id = $6
        RETURNING id;
    `;
    
    const values = [
        factObj.title, 
        factObj.text, 
        factObj.font, 
        factObj.category, 
        factObj.contenido_quiz,
        factObj.id 
    ];

    try {
        const result = await db.query(query, values);
        return result.rowCount > 0;

    } catch (err) {
        console.error("Error al actualizar fact:", err);
        throw err;
    }
}

async function deleteFact (factId) {
    const query = `DELETE FROM facts WHERE id = $1`;

    try {
        const result = await db.query(query, [factId]);
        return result.rowCount == 1;

    } catch (err) {
        console.error("Error al eliminar fact:", err);
        throw err;
    }
    
}


export {
    getFactsAll,
    getFactById,
    getFactsByUserId,
    getFactsCategory,
    createFact,
    addToRepo,
    updateFact,
    deleteFact
}