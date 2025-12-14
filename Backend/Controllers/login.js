const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
function securePassword(password) {
    if (password.length < 8) {
        return "La contraseña debe tener al menos 8 caracteres";
    }
    if (!/[A-Z]/.test(password)) {
        return "La contraseña debe contener al menos una letra mayúscula";
    }
    if (!/[a-z]/.test(password)) {
        return "La contraseña debe contener al menos una letra minúscula";
    }
    if (!/[0-9]/.test(password)) {
        return "La contraseña debe contener al menos un número";
    }
    if (!/[!@#$%^&*(),.?":{}|<>_\-]/.test(password)) {
        return "La contraseña debe contener al menos un símbolo especial";
    }
    return null;
}
const register = async ( req, res) => {
    const {username, email, password} = req.body;
    console.log("REGISTER BODY:",req.body)
    try{
        if (!username || !email || !password ){
            return res.status(400).json({error: "faltan datos"});
        }
        const passwordError = securePassword(password);
        if (passwordError){
            return res.status(400).json({ error: passwordError});
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
            'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING  id, username, email',
            [username,email, hashedPassword]);
        return res.json({
            message: "usuario creado con exito",
            user : insertUser.rows[0]
        });
    }
    catch(error){
        console.error("ERROR REGISTER: ",error);
        return res.status(500).json({ error: "error interno del servidor"});
    }
};
const login = async (req , res) => {
    const {identifier , password} = req.body;
    console.log("LOGIN BODY:", req.body);
    try {
        const userData = await db.query(
            'SELECT * FROM users WHERE email = $1 OR username = $1',
            [identifier]
        );
        if (userData.rows.length === 0 ){
            return res.status(400).json({ error : "usuario no encontrado"});
        }
        const user = userData.rows[0];
        const match = await bcrypt.compare (password, user.password);
        if (!match){
            return res.status(400).json ({ error: "contraseña incorrecta"});
        }
        const token = jwt.sign(
            { id: user.id, username: user.username},
            process.env.JWT_SECRET,
            {expiresIn: "7d"}
        );
        return res.json({
            message : "login correcto",
            token,
            user: {id:user.id, username:user.username}
        });
    }
    catch(error){
        console.error("ERROR LOGIN:", error);
        return res.status(500).json({ error: "error interno del servidor"});
    }
};
const me = async (req, res) => {
    try {
        const userData = await db.query(
            "SELECT id, username, email, score FROM users WHERE id = $1",
            [req.user.id]
        );
        if (userData.rows.length === 0){
            return res.status(404).json ({ error: "usuario no encontrado"});
        }
        res.json (userData.rows[0]);

    }
    catch(err){
        console.error(err);
        res.status(500).json({ error: "error interno del servidor" });
    }
};
module.exports = { register, login, me };