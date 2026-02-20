import express from 'express';
import cors from 'cors';
import dotenv from "dotenv";
import { iniciarCronJobs } from './services/cronService.js';

dotenv.config();
const app = express(); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const allowedOrigins = [
  'http://localhost:3000',
  'https://almacen-factos.vercel.app',
  'https://almacen-factos-1.onrender.com'
];

app.use(cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));

import profileRoutes from './routes/profileRoutes.js';
import factsRoutes from './routes/Facts.js';
import iaRoutes from './routes/Ia.js';
import authRoutes from './routes/login.js';
import savedFactsRoutes from './routes/savedFactsRoutes.js'; 
import quizRoutes from './routes/quizRoutes.js';
import rankingRoutes from './routes/ranking.js';

iniciarCronJobs();

app.use("/api/auth", authRoutes);
app.use('/api/facts', factsRoutes);
app.use('/api/ia', iaRoutes);
app.use('/api/ranking',rankingRoutes);
app.use('/api/users', profileRoutes); 
app.use('/api/saved', savedFactsRoutes);
app.use('/api/quiz', quizRoutes);

export default app;