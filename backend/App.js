import express from 'express';
import cors from 'cors';
import dotenv from "dotenv";
import profileRoutes from './routes/profileRoutes.js';
import factsRoutes from './routes/Facts.js';
import iaRoutes from './routes/Ia.js';
import authRoutes from './routes/login.js';
import savedFactsRoutes from './routes/savedFactsRoutes.js'; 

const app = express (); 

app.use(cors());

//middleware para parsear json
app.use(express.json());


dotenv.config();

app.use(cors({
    origin: "http://localhost:8080",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));

app.use(express.urlencoded({ extended: true }));

app.use('/api/users', profileRoutes);
app.use('/api/facts', factsRoutes);
app.use('/api/ia', iaRoutes);
app.use("/api/auth", authRoutes);
// app.use('/api/trophies', trophyRoutes);
// app.use('/api/users', usersRoutes);
// app.use('/api/almacen-facts', almacenFactsRoutes);

app.use('/api/users', profileRoutes);
app.use('/api/saved', savedFactsRoutes);

export default app;