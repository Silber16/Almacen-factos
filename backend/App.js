import express from 'express';
import cors from 'cors';
import dotenv from "dotenv";

dotenv.config();
const app = express(); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: "http://localhost:8080",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));
import profileRoutes from './routes/profileRoutes.js';
import factsRoutes from './routes/Facts.js';
import iaRoutes from './routes/Ia.js';
import authRoutes from './routes/login.js';
import savedFactsRoutes from './routes/savedFactsRoutes.js'; 
app.use("/api/auth", authRoutes);
app.use('/api/facts', factsRoutes);
app.use('/api/ia', iaRoutes);


app.use('/api/users', profileRoutes); 

//epositorio personal
app.use('/api/saved', savedFactsRoutes);

export default app;