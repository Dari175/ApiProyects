const express = require('express');
const router = express.Router();
const proyectoController = require('../controllers/proyectoController');

// Rutas principales
router.get('/', proyectoController.obtenerProyectos);
router.get('/:id', proyectoController.obtenerProyectoPorId);
router.post('/', proyectoController.crearProyecto);
router.put('/:id', proyectoController.actualizarProyecto);
router.delete('/:id', proyectoController.eliminarProyecto);

// Rutas de filtrado
router.get('/estado/:estado', proyectoController.filtrarPorEstado);
router.get('/categoria/:categoria', proyectoController.filtrarPorCategoria);

module.exports = router;