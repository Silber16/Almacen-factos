const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const register = async ( req, res) => {
    const { name, last_name, username, email, password, birth_date } = req.body;
    try{
        if (!name || !last_name || !username || !password || !birth_date){
            return res.status(400).json({error: "faltan datos"});
        }
        const checkUser = await db.query(
            'SELECT * FROM users WHERE email = $1 OR username = $2',
            [email, username]
        );
        if ( checkUser.rows.length > 0){
            return res.status(400).json({ error: "email o username ya registrado"});
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const insertUser = await db.query(
            'INSERT INTO users (name, last_name, username, email, password, birth_date) VALUES ($1, $2, $3, $4, $5, $6) RETURNING  id, name, username, email',
            [name, last_name, username,email, hashedPassword, birth_date]);
        return res.json({
            message: "usuario creado con exito",
            user : insertUser.rows[0]
        });
    }
    catch(error){
        console.error(error);
        return res.status(500).json({ error: "error interno del servidor"});
    }
};
const login = async (req , res) => {

}
module.exports = {register , login };


