const express = require('express');
const mongoose = require('mongoose');
const clientRoutes = require('./routes/ClientRoutes');
const cors = require('cors');
require('dotenv').config(); // Cargar las variables de entorno
const helmet = require('helmet');
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
    origin: 'https://auth0-login-piii-24.vercel.app/', // Cambia esto si tu cliente está en otro dominio
    methods: 'GET,POST,PUT,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true
};

app.use(cors(corsOptions));

// Manejo de solicitudes OPTIONS para CORS preflight
app.options('*', (req, res) => {
    res.header("Access-Control-Allow-Origin", "https://auth0-login-piii-24.vercel.app/");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization/json");
    res.sendStatus(200);
});

// Agregar encabezado Content Security Policy (CSP)
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"], // Permite solo recursos del mismo origen
      scriptSrc: ["'self'", "https://vercel.live"], // Permite scripts de Vercel
      connectSrc: ["'self'", "https://vercel.live"], // Permite conexiones a Vercel
      imgSrc: ["'self'", "https://vercel.live"], // Permite imágenes de Vercel
      styleSrc: ["'self'", "https://vercel.live"], // Permite estilos de Vercel
    },
  })
);
app.use(express.json());
// Rutas
app.use('/api', require('./routes/ClientRoutes'));


app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});