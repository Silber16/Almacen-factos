const db = require("./config/db");

async function getFactsAll () {
    const query = "SELECT * FROM facts";
    
    try {
        const result = await db.query(query);

        return result.rows;
    } catch (err) {
        console.error("Error al obtener facts: ", err);
        throw err;
    }
}

async function getFactsByUserId (userId) {
    const query = `SELECT * FROM facts WHERE userId = ${userId}`;

    try {
        const result = await db.query(query);

        return result.rows;
    } catch (err) {
        console.error("Error al obtener facts: ", err);
        throw err;
    }
}

async function getFactsCategory (category) {
    const query = `SELECT * FROM facts WHERE category = ${category}`;

    try {
        const result = await db.query(query);

        return result.rows;
    } catch (err) {
        console.error("Error al obtener facts: ", err);
        throw err;
    }
}

async function getFactById (userId) {
    const query = `SELECT * FROM facts WHERE id = ${userId}`;
    
    try {
        const result = await db.query(query);

        return result.rows;
    } catch (err) {
        console.error("Error al obtener fact:", err);
        throw err;
    }
}

async function createFact (factObj) {
    const query = `
        INSERT INTO 
            Facts(title, text, font, category, contenido_quiz)
        VALUES 
            ($1, $2, $3, $4, $5)
        RETURNING id;
    `;
    
    const values = [
        factObj.title, 
        factObj.text, 
        factObj.font, 
        factObj.category, 
        factObj.quiz_content
    ];

    try {
        const result = await db.query(query, values);
        return result.rowCount > 0;

    } catch (error) {
        console.error("Error al crear fact:", error);
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
    const query = `DELETE FROM facts WHERE id = ${factId}`;

    try {
        const result = await db.query(query);
        return result.rowCount == 1;

    } catch (err) {
        console.error("Error al eliminar fact:", err);
        throw err;
    }
    
}


module.exports = {
    getFactsAll,
    getFactById,
    getFactsByUserId,
    getFactsCategory,
    createFact,
    updateFact,
    deleteFact
}