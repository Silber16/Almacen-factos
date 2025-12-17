import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import db from "./config/db.js";
import authRoutes from "./Routes/login.js";

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

app.get("/", async (req, res) => {
    try {
      const result = await db.query("SELECT * FROM facts");
    res.json(result.rows);
    } catch (err) {
    console.error(err);
    res.status(500).send("Error interno del servidor");
    }
});

app.use("/api/auth", authRoutes);

export default app;
