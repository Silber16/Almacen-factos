import express from 'express';
import cors from 'cors';
import * as db from './config/db.js';
import profileRoutes from './Routes/profileRoutes.js';
import savedFactsRoutes from './Routes/savedFactsRoutes.js'; 

const app = express (); 

app.use(cors());

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

app.use('/api/users', profileRoutes);
app.use('/api/saved', savedFactsRoutes);

export default app;