import db from '../config/db.js';

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
async function updateUserProfile(user) {
    const query = `
        UPDATE users
        SET name = $1, username = $2, bio = $3, profile_picture = $4
        WHERE id = $5
        RETURNING id, name, username, score, bio, profile_picture, created_at;
    `;
    const userIdNum = parseInt(user.id, 10);

    const result = await db.query(query, [
        user.name,
        user.username,
        user.bio,
        user.profilePicture,
        userIdNum
    ]);
    
    return result.rows[0];
}

//obtener los factos publicados por el usuario, van a aparecer tipo twitter
// obtener los factos publicados por un usuario (perfil)
async function getUserFactos(userId) {
    const query = `
    SELECT 
        f.id, 
        f.title, 
        f.content, 
        f.font, 
        f.ia_responseverdict, 
        f.ia_response,
        f.created_at,
        f.created_by AS "createdBy",
        u.username AS "userName"
    FROM facts f
    JOIN users u ON f.created_by = u.id
    WHERE f.created_by = $1
    ORDER BY f.created_at DESC;
    `;

    const { rows } = await db.query(query, [userId]);
    return rows;
}


//obtener logros del usuario
async function getUserTrophies(userPoints) {
    const query = `
        SELECT t.id, t.title, t.description, t.iconurl, t.points
        FROM trophies t
        WHERE t.points <= $1
        ORDER BY t.points DESC;
    `;
    const result = await db.query(query, [userPoints]);
    return result.rows;
}

//buscar usuario por username
async function getUserByUsername(username) {
    const query = `
    SELECT id, name, username
    FROM users
    WHERE username = $1;
    `;
    const result = await db.query(query, [username]);
    return result.rows[0];
}


export {
    getUserById,
    updateUserProfile,
    getUserFactos,
    getUserTrophies,
    getUserByUsername
};