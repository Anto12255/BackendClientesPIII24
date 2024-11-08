// server.js o app.js
const express = require('express');
const mongoose = require('mongoose');
const clientRoutes = require('./routes/ClientRoutes');
const cors = require('cors');
require('dotenv').config(); // Cargar las variables de entorno

const app = express();
const PORT = process.env.PORT ||  5001;

console.log('MONGODB_URI:', process.env.MONGODB_URI); // Para depuración
// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(() => console.log('Conectado a MongoDB'))
    .catch((error) => console.log('Error conectando a MongoDB:', error));

// Middleware para manejar JSON
app.use(express.json());
// Habilitar CORS
const corsOptions = {
    origin: 'http://localhost:3000', // Cambia esto si tu cliente está en otro dominio
    methods: 'GET,POST,PUT,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true
};

app.use(cors(corsOptions));

// Manejo de solicitudes OPTIONS para CORS preflight
app.options('*', (req, res) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization/json");
    res.sendStatus(200);
});
app.use(express.json());
// Rutas
app.use('/api', require('./routes/ClientRoutes'));


app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});