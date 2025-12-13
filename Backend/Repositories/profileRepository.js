const db = require('../config/db.js');

//obtener usuario por id
async function getUserById(userId) {
    const query = `
        SELECT id, name, username, score, bio, profile_picture, created_at
        FROM users
        WHERE id= $1;
    `;
    const result = await db.query(query, [userId]);
    return result.rows[0];
}


//actualizar o editar perfil
async function updateUserProfile(userId, name, username, bio, profilePicture) {
    const query = `
        UPDATE users
        SET bio = $1, username = $2, bio = $3,  profile_picture = $4
        WHERE id = $5
        RETURNING id, naame, username, score, bio, profile_picture, created_at;
    `;
    const result = await db.query(query [bio, profilePicture, userId]);
    return result.rows[0];
}


//obtener los factos publicados por el usuario, van a aparecer tipo twitter
async function getUserFactos(userId) {
    const query = `
        SELECT id, content, font, created_at
        FROM facts
        WHERE createdby = $1
        ORDER BY created_at DESC;
    `;
    const result = await db.query(query, [userId]);
    return result.rows;
}


//obtener logros del usuario
async function getUserTrophies(userId) {
    const query = `
        SELECT t.id, t.title, t.description, t.iconurl, t.pointsneeded, t.category, ut.earned_at
        FROM trophies t
        INNER JOIN user_trophy ut ON t.id = ut.trophyid
        WHERE ut.usersid = $1
        ORDER BY ut.earned_at DESC;
    `;
    const result = await db.query(query, [userId]);
    return result.rows;
}


module.exports = {
    getUserById,
    updateUserProfile,
    getUserFactos,
    getUserTrophies
}