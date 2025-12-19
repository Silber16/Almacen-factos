import db from "../config/db.js";
const emailorusername = async (identifier) => {
    const res = await db.query(
        'SELECT * FROM users WHERE email = $1 OR username = $1',
        [identifier]
    );
    return res.rows[0];
};
const existsemailorusername = async (email, username) => {
    const res = await db.query(
        'SELECT 1 FROM users WHERE email = $1 OR username = $2',
        [email, username]
    );
    return res.rows.length > 0;
};
const createUser = async (username, email, hashedPassword) => {
    const res = await db.query(
        'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email',
        [username, email, hashedPassword]
    );
    return res.rows[0];
};
const findId = async (id) => {
    const res = await db.query(
        'SELECT id, username, email, score FROM users WHERE id = $1',
        [id]
    );
    return res.rows[0];
};
export default {
    emailorusername,
    existsemailorusername,
    createUser,
    findId
};
