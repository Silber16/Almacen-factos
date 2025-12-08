const express = require ( 'express' ); 
const db = require ( './db' ); 
const quizRoutes = require('../Routes/quizRoutes');

const app = express (); 

app.use(express.json());

app.get('/', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM facts');
        console.log(result)
        console.log(result.rows); 
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error interno del servidor');
    }
});

app.use('/quiz', quizRoutes);

module.exports = app;