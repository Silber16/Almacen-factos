import express from 'express';
import cors from 'cors';
import { query } from './config/db.js';
import quizRoutes from './Routes/quizRoutes.js';

const app = express (); 

app.use(cors({
    origin: "*"
}));

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

export default app;