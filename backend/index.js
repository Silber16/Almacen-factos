import dotenv from 'dotenv';
import app from './App.js';

dotenv.config({ path: './config/.env' });

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log("SERVIDOR INICIADO EN 0.0.0.0:" + PORT);
})
