const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
function securePassword(password, name, last_name, birth_date) {
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
    const passwordLower = password.toLowerCase();
    if (passwordLower.includes(name.toLowerCase())) {
        return "La contraseña no puede contener tu nombre";
    }
    if (passwordLower.includes(last_name.toLowerCase())) {
        return "La contraseña no puede contener tu apellido";
    }
    if (birth_date) {
        const year = new Date(birth_date).getFullYear().toString();
        if (password.includes(year)) {
            return "La contraseña no puede contener tu año de nacimiento";
        }
    }
    return null;
}
const register = async ( req, res) => {
    const { name, last_name, username, email, password, birth_date } = req.body;
    try{
        if (!name || !last_name || !username || !email || !password || !birth_date){
            return res.status(400).json({error: "faltan datos"});
        }
        const passwordError = securePassword(password, name, last_name, birth_date);
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
    const {identifier , password} = req.body;
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
            user: {id:user.id, name:user.name, username:user.username}
        });
    }
    catch(error){
        console.error(error);
        return res.status(500).json({ error: "error interno del servidor"});
    }
};
const me = async (erq, res) => {
    try {
        const userData = await db.query(
            "SELECT id, name, last_name, username, email, birth_date, score FROM users WHERE id = $1",
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
module.exports = {register , login, me };