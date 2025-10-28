const mongoose = require('mongoose');

const proyectoSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: [true, 'El título es obligatorio'],
    trim: true
  },
  ubicacion: {
    type: String,
    required: [true, 'La ubicación es obligatoria'],
    trim: true
  },
  fecha: {
    type: Date,
    default: Date.now
  },
  categoria: {
    type: String,
    required: [true, 'La categoría es obligatoria'],
    trim: true
  },
  estado: {
    type: String,
    enum: ['En Proceso', 'Completado', 'Pendiente', 'Cancelado'],
    default: 'En Proceso'
  },
  cliente: {
    type: String,
    required: [true, 'El cliente es obligatorio'],
    trim: true
  },
  duracion: {
    type: String,
    trim: true
  },
  area: {
    type: String,
    trim: true
  },
  equipo: {
    type: String,
    trim: true
  },
  // Campo LEGACY - mantener para retrocompatibilidad
  urlImagen: {
    type: String,
    trim: true
  },
  // Nuevo campo flexible: soporta URLs Y Base64
  imagenes: [{
    nombre: {
      type: String,
      trim: true
    },
    // Campo tipo para identificar URL o Base64
    tipo: {
      type: String,
      enum: ['url', 'base64'],
      required: true
    },
    // Para imágenes tipo URL
    url: {
      type: String,
      trim: true
    },
    // Para imágenes tipo Base64
    mimeType: {
      type: String,
      trim: true
    },
    data: {
      type: String // Base64 string
    },
    size: {
      type: Number // Tamaño en bytes (solo para base64)
    },
    esPrincipal: {
      type: Boolean,
      default: false
    }
  }],
  descripcionCorta: {
    type: String,
    trim: true
  },
  descripcionCompleta: {
    type: String,
    trim: true
  },
  desafios: {
    type: String,
    trim: true
  },
  soluciones: {
    type: String,
    trim: true
  },
  resultados: {
    type: String,
    trim: true
  },
  productosUtilizados: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Validación personalizada: cada imagen debe tener URL o Data, no ambos
proyectoSchema.path('imagenes').validate(function(imagenes) {
  if (!imagenes || imagenes.length === 0) return true;
  
  for (let imagen of imagenes) {
    // Si es tipo URL, debe tener url
    if (imagen.tipo === 'url' && !imagen.url) {
      throw new Error('Las imágenes tipo URL deben tener el campo "url"');
    }
    
    // Si es tipo base64, debe tener data
    if (imagen.tipo === 'base64' && !imagen.data) {
      throw new Error('Las imágenes tipo base64 deben tener el campo "data"');
    }
    
    // No puede tener ambos
    if (imagen.url && imagen.data) {
      throw new Error('Una imagen no puede tener URL y data al mismo tiempo');
    }
  }
  
  return true;
}, 'Validación de imágenes falló');

// Método virtual para obtener la imagen principal
proyectoSchema.virtual('imagenPrincipal').get(function() {
  // Prioridad 1: Buscar en el nuevo array de imágenes
  if (this.imagenes && this.imagenes.length > 0) {
    const principal = this.imagenes.find(img => img.esPrincipal);
    const imagen = principal || this.imagenes[0];
    
    // Retornar formato según el tipo
    if (imagen.tipo === 'url' || imagen.url) {
      return {
        tipo: 'url',
        url: imagen.url,
        nombre: imagen.nombre
      };
    } else if (imagen.tipo === 'base64' || imagen.data) {
      return {
        tipo: 'base64',
        data: imagen.data,
        mimeType: imagen.mimeType,
        nombre: imagen.nombre
      };
    }
  }
  
  // Prioridad 2: Usar la URL antigua si existe (retrocompatibilidad)
  if (this.urlImagen) {
    return {
      tipo: 'url',
      url: this.urlImagen,
      nombre: 'Imagen legacy'
    };
  }
  
  return null;
});

// Método virtual para obtener todas las imágenes organizadas
proyectoSchema.virtual('todasLasImagenes').get(function() {
  const imagenesCompletas = [];
  
  // Agregar imágenes del nuevo sistema
  if (this.imagenes && this.imagenes.length > 0) {
    imagenesCompletas.push(...this.imagenes.map(img => ({
      _id: img._id,
      tipo: img.tipo || (img.data ? 'base64' : 'url'),
      nombre: img.nombre,
      url: img.url,
      data: img.data,
      mimeType: img.mimeType,
      size: img.size,
      esPrincipal: img.esPrincipal
    })));
  }
  
  // Agregar URL antigua si existe y no hay otras imágenes
  if (this.urlImagen && imagenesCompletas.length === 0) {
    imagenesCompletas.push({
      tipo: 'url',
      url: this.urlImagen,
      nombre: 'Imagen legacy',
      esPrincipal: true
    });
  }
  
  return imagenesCompletas;
});

// Asegurar que los virtuals se incluyan en JSON
proyectoSchema.set('toJSON', { virtuals: true });
proyectoSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Proyecto', proyectoSchema);