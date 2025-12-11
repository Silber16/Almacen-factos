const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const register = async ( req, res) => {
    const { name, last_name, username, email, password, birth_date } = req.body;
    
}
const login = async (req , res) => {

}
module.exports = {register , login };


