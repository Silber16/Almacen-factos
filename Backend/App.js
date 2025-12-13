const express = require ( 'express' ); 
const app = express (); 
const factsRoutes = require('./Routes/Facts');
const trophyRoutes = require('./Routes/Trophy');
const usersRoutes = require('./Routes/Users');
const almacenFactsRoutes = require('./Routes/AlmacenFacts');
const cors = require('cors');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: 'http://localhost:8080'
}));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

// app.use('/api/', (req, res) => {
//   console.log('recibido');
//   res.json({ message: 'API asedasdasds' });
// });

app.use('/api/facts', factsRoutes);
// app.use('/api/trophies', trophyRoutes);
// app.use('/api/users', usersRoutes);
// app.use('/api/almacen-facts', almacenFactsRoutes);

module.exports = app;