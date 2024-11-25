// server.js
const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
const corsOptions = {
    origin: '*', // Cambia '*' por el dominio específico en producción si es necesario
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization']
  };
  app.use(cors(corsOptions));
  
app.use(express.json());  // Parsear las solicitudes con JSON

// Ruta de prueba para asegurarnos que el servidor esté funcionando
app.get('/', (req, res) => {
  res.send('Servidor Express está corriendo');
});

// Ruta para manejar la solicitud de login
app.post('/usuarios/login', (req, res) => {
  const { username, password } = req.body;

  // Lógica de autenticación (puedes personalizarla)
  if (username === 'admin' && password === 'password') {
    return res.status(200).json({ message: 'Login exitoso' });
  } else {
    return res.status(401).json({ message: 'Credenciales incorrectas' });
  }
});

// Configurar el puerto donde se escucha el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
