import express from 'express'; 
import dotenv from "dotenv";

import factsRoutes from './routes/Facts.js';
import iaRoutes from './routes/Ia.js';
import authRoutes from './routes/login.js';
import RankingRoutes from './routes/ranking.js';

import cors from 'cors';
const app = express (); 

dotenv.config();

app.use(cors({
    origin: "http://localhost:8080",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api/facts', factsRoutes);
app.use('/api/ia', iaRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/ranking", RankingRoutes);
// app.use('/api/trophies', trophyRoutes);
// app.use('/api/users', usersRoutes);
// app.use('/api/almacen-facts', almacenFactsRoutes);

export default app;
