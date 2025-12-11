const express = require ( 'express' ); 
const db = require ( './config/db' ); 
const cors = require('cors');
const app = express (); 
app.use(express.json());
app.use(cors());
app.get('/', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM facts');
        console.log(result.rows);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error interno del servidor');
    }
});
const authroutes = require('./Routes/login');
app.use('/api/auth', authroutes);
module.exports = app;