const Proyecto = require('../models/Proyecto');

// Validar y procesar imagen base64
const procesarImagenBase64 = (imagenData) => {
  if (!imagenData.data) {
    throw new Error('La imagen no contiene datos');
  }

  // Extraer mime type si viene en formato data:image/...;base64,...
  let base64String = imagenData.data;
  let mimeType = imagenData.mimeType || 'image/jpeg';

  if (base64String.startsWith('data:')) {
    const matches = base64String.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (matches && matches.length === 3) {
      mimeType = matches[1];
      base64String = matches[2];
    }
  }

  // Validar que sea una imagen
  if (!mimeType.startsWith('image/')) {
    throw new Error('El archivo debe ser una imagen');
  }

  // Calcular tamaño aproximado en bytes
  const size = Math.floor((base64String.length * 3) / 4);

  // Validar tamaño (máximo 5MB)
  const MAX_SIZE = 5 * 1024 * 1024;
  if (size > MAX_SIZE) {
    throw new Error('La imagen excede el tamaño máximo permitido (5MB)');
  }

  return {
    nombre: imagenData.nombre || 'imagen.jpg',
    mimeType,
    data: base64String,
    size,
    esPrincipal: imagenData.esPrincipal || false,
    tipo: 'base64' // Identificador del tipo
  };
};

// Validar y procesar URL de imagen
const procesarImagenURL = (imagenData) => {
  if (!imagenData.url) {
    throw new Error('La URL de la imagen es requerida');
  }

  // Validar formato básico de URL
  try {
    new URL(imagenData.url);
  } catch (error) {
    throw new Error('URL inválida');
  }

  return {
    nombre: imagenData.nombre || 'Imagen desde URL',
    url: imagenData.url,
    esPrincipal: imagenData.esPrincipal || false,
    tipo: 'url' // Identificador del tipo
  };
};

// Procesar imagen según el tipo (URL o Base64)
const procesarImagen = (imagenData) => {
  // Si tiene data, es base64
  if (imagenData.data) {
    return procesarImagenBase64(imagenData);
  }
  
  // Si tiene url, es URL
  if (imagenData.url) {
    return procesarImagenURL(imagenData);
  }
  
  throw new Error('Debe proporcionar una imagen en base64 (data) o una URL (url)');
};

// Obtener todos los proyectos
exports.obtenerProyectos = async (req, res) => {
  try {
    const proyectos = await Proyecto.find().sort({ fecha: -1 });
    
    // Agregar información de compatibilidad
    const proyectosFormateados = proyectos.map(p => {
      const obj = p.toObject();
      
      // Contar tipos de imágenes
      const imagenesBase64 = obj.imagenes?.filter(img => img.tipo === 'base64' || img.data)?.length || 0;
      const imagenesURL = obj.imagenes?.filter(img => img.tipo === 'url' || img.url)?.length || 0;
      
      return {
        ...obj,
        estadisticasImagenes: {
          total: obj.imagenes?.length || 0,
          base64: imagenesBase64,
          url: imagenesURL,
          tieneURLLegacy: !!obj.urlImagen
        }
      };
    });
    
    res.json({
      success: true,
      count: proyectos.length,
      data: proyectosFormateados
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
    
    const obj = proyecto.toObject();
    
    // Contar tipos de imágenes
    const imagenesBase64 = obj.imagenes?.filter(img => img.tipo === 'base64' || img.data)?.length || 0;
    const imagenesURL = obj.imagenes?.filter(img => img.tipo === 'url' || img.url)?.length || 0;
    
    res.json({
      success: true,
      data: {
        ...obj,
        estadisticasImagenes: {
          total: obj.imagenes?.length || 0,
          base64: imagenesBase64,
          url: imagenesURL,
          tieneURLLegacy: !!obj.urlImagen
        }
      }
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
    const datosProyecto = { ...req.body };

    // Procesar imágenes si existen (pueden ser URLs o Base64)
    if (datosProyecto.imagenes && Array.isArray(datosProyecto.imagenes)) {
      datosProyecto.imagenes = datosProyecto.imagenes.map(procesarImagen);
    }

    const nuevoProyecto = new Proyecto(datosProyecto);
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
    const datosActualizacion = { ...req.body };

    // Procesar imágenes si existen (pueden ser URLs o Base64)
    if (datosActualizacion.imagenes && Array.isArray(datosActualizacion.imagenes)) {
      datosActualizacion.imagenes = datosActualizacion.imagenes.map(procesarImagen);
    }

    const proyectoActualizado = await Proyecto.findByIdAndUpdate(
      req.params.id,
      datosActualizacion,
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

// Agregar imagen a un proyecto existente (URL o Base64)
exports.agregarImagen = async (req, res) => {
  try {
    const proyecto = await Proyecto.findById(req.params.id);
    
    if (!proyecto) {
      return res.status(404).json({
        success: false,
        message: 'Proyecto no encontrado'
      });
    }

    const nuevaImagen = procesarImagen(req.body);
    
    // Inicializar array si no existe (para proyectos antiguos)
    if (!proyecto.imagenes) {
      proyecto.imagenes = [];
    }
    
    // Si es principal, desmarcar las demás
    if (nuevaImagen.esPrincipal) {
      proyecto.imagenes.forEach(img => img.esPrincipal = false);
    }

    proyecto.imagenes.push(nuevaImagen);
    await proyecto.save();

    res.json({
      success: true,
      message: `Imagen ${nuevaImagen.tipo === 'url' ? 'URL' : 'base64'} agregada exitosamente`,
      data: proyecto
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error al agregar imagen',
      error: error.message
    });
  }
};

// Eliminar imagen de un proyecto
exports.eliminarImagen = async (req, res) => {
  try {
    const { id, imagenId } = req.params;
    
    const proyecto = await Proyecto.findById(id);
    
    if (!proyecto) {
      return res.status(404).json({
        success: false,
        message: 'Proyecto no encontrado'
      });
    }

    if (!proyecto.imagenes || proyecto.imagenes.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Este proyecto no tiene imágenes'
      });
    }

    const imagenAEliminar = proyecto.imagenes.find(
      img => img._id.toString() === imagenId
    );

    if (!imagenAEliminar) {
      return res.status(404).json({
        success: false,
        message: 'Imagen no encontrada'
      });
    }

    proyecto.imagenes = proyecto.imagenes.filter(
      img => img._id.toString() !== imagenId
    );

    await proyecto.save();

    res.json({
      success: true,
      message: 'Imagen eliminada exitosamente',
      tipoEliminado: imagenAEliminar.tipo || (imagenAEliminar.data ? 'base64' : 'url'),
      data: proyecto
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error al eliminar imagen',
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