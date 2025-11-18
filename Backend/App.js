const express = require ( 'express' ); 
const db = require ( './config/db' ); 

const app = express (); 

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

app.listen(3000, () => { 
    console.log( ' El servidor se está ejecutando en el puerto 3000' ) ; 
    }) ;
