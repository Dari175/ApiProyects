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
  urlImagen: {
    type: String,
    trim: true
  },
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

module.exports = mongoose.model('Proyecto', proyectoSchema);
