const express = require('express');
const cors = require('cors');
const conectarDB = require('./config/database');
const proyectoRoutes = require('./routes/proyectoRoutes');

const app = express();

// Conectar a la base de datos
conectarDB();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/proyectos', proyectoRoutes);

// Ruta raíz
app.get('/', (req, res) => {
  res.json({
    message: 'API de Gestión de Proyectos',
    version: '1.0.0',
    endpoints: {
      'GET /api/proyectos': 'Obtener todos los proyectos',
      'GET /api/proyectos/:id': 'Obtener un proyecto específico',
      'POST /api/proyectos': 'Crear un nuevo proyecto',
      'PUT /api/proyectos/:id': 'Actualizar un proyecto',
      'DELETE /api/proyectos/:id': 'Eliminar un proyecto',
      'GET /api/proyectos/estado/:estado': 'Filtrar por estado',
      'GET /api/proyectos/categoria/:categoria': 'Filtrar por categoría'
    }
  });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  });
});

module.exports = app;
