const express = require ( 'express' ); 
const db = require ( './config/db' ); 

const app = express (); 

//middleware para parsear json
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

const profileRoutes = require('./Routes/profileRoutes');

app.use('/api/users', profileRoutes);

module.exports = app;