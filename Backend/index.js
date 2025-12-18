import {app} from './App.js';
import dotenv from 'dotenv'

dotenv.config();

const PORT = process.env.PORT || 5000;

app.listen(PORT,() => {
    console.log("SERVIDOR INICIADO EN 0.0.0.0:" + PORT);
});
