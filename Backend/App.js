require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./config/db');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: "http://localhost:8080",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));

app.get('/', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM facts');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error interno del servidor');
    }
});

const authroutes = require('./Routes/login.js');
app.use('/api/auth', authroutes);

module.exports = app;