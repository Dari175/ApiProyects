const Proyecto = require('../models/Proyecto');

// Obtener todos los proyectos
exports.obtenerProyectos = async (req, res) => {
  try {
    const proyectos = await Proyecto.find().sort({ fecha: -1 });
    res.json({
      success: true,
      count: proyectos.length,
      data: proyectos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener proyectos',
      error: error.message
    });
  }
};

// Obtener un proyecto por ID
exports.obtenerProyectoPorId = async (req, res) => {
  try {
    const proyecto = await Proyecto.findById(req.params.id);
    
    if (!proyecto) {
      return res.status(404).json({
        success: false,
        message: 'Proyecto no encontrado'
      });
    }
    
    res.json({
      success: true,
      data: proyecto
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener el proyecto',
      error: error.message
    });
  }
};

// Crear un nuevo proyecto
exports.crearProyecto = async (req, res) => {
  try {
    const nuevoProyecto = new Proyecto(req.body);
    const proyectoGuardado = await nuevoProyecto.save();
    
    res.status(201).json({
      success: true,
      message: 'Proyecto creado exitosamente',
      data: proyectoGuardado
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error al crear el proyecto',
      error: error.message
    });
  }
};

// Actualizar un proyecto
exports.actualizarProyecto = async (req, res) => {
  try {
    const proyectoActualizado = await Proyecto.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!proyectoActualizado) {
      return res.status(404).json({
        success: false,
        message: 'Proyecto no encontrado'
      });
    }
    
    res.json({
      success: true,
      message: 'Proyecto actualizado exitosamente',
      data: proyectoActualizado
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error al actualizar el proyecto',
      error: error.message
    });
  }
};

// Eliminar un proyecto
exports.eliminarProyecto = async (req, res) => {
  try {
    const proyectoEliminado = await Proyecto.findByIdAndDelete(req.params.id);
    
    if (!proyectoEliminado) {
      return res.status(404).json({
        success: false,
        message: 'Proyecto no encontrado'
      });
    }
    
    res.json({
      success: true,
      message: 'Proyecto eliminado exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar el proyecto',
      error: error.message
    });
  }
};

// Filtrar proyectos por estado
exports.filtrarPorEstado = async (req, res) => {
  try {
    const proyectos = await Proyecto.find({ estado: req.params.estado });
    res.json({
      success: true,
      count: proyectos.length,
      data: proyectos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al filtrar proyectos',
      error: error.message
    });
  }
};

// Filtrar proyectos por categoría
exports.filtrarPorCategoria = async (req, res) => {
  try {
    const proyectos = await Proyecto.find({ categoria: req.params.categoria });
    res.json({
      success: true,
      count: proyectos.length,
      data: proyectos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al filtrar proyectos',
      error: error.message
    });
  }
};
