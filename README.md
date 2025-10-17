# 🏗️ API REST - Gestión de Proyectos

API RESTful para la gestión de proyectos de construcción, desarrollada con Node.js, Express y MongoDB Atlas.

## 📋 Tabla de Contenidos

- [Características](#características)
- [Tecnologías](#tecnologías)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Endpoints](#endpoints)
- [Ejemplos de Uso](#ejemplos-de-uso)
- [Modelo de Datos](#modelo-de-datos)

## ✨ Características

- ✅ CRUD completo de proyectos
- ✅ Filtrado por estado y categoría
- ✅ Validación de datos
- ✅ Conexión a MongoDB Atlas
- ✅ Arquitectura MVC
- ✅ Manejo de errores
- ✅ CORS habilitado

## 🛠️ Tecnologías

- **Node.js** - Entorno de ejecución
- **Express** - Framework web
- **MongoDB Atlas** - Base de datos en la nube
- **Mongoose** - ODM para MongoDB
- **dotenv** - Variables de entorno
- **cors** - Middleware CORS

## 🚀 Instalación

1. **Clonar el repositorio:**
```bash
git clone https://github.com/tu-usuario/api-gestion-proyectos.git
cd api-gestion-proyectos
```

2. **Instalar dependencias:**
```bash
npm install
```

3. **Configurar variables de entorno:**

Crea un archivo `.env` en la raíz del proyecto:

```env
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/nombre-db?retryWrites=true&w=majority
PORT=3000
NODE_ENV=development
```

4. **Iniciar el servidor:**
```bash
# Modo desarrollo (con nodemon)
npm run dev

# Modo producción
npm start
```

El servidor estará corriendo en `http://localhost:3000`

## ⚙️ Configuración

### MongoDB Atlas

1. Crea una cuenta en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Crea un nuevo cluster (gratuito)
3. Configura las credenciales de acceso
4. Obtén tu connection string
5. Agrega tu IP a la lista blanca o permite acceso desde cualquier IP (0.0.0.0/0)
6. Reemplaza en el `.env` con tus credenciales

## 📁 Estructura del Proyecto

```
proyecto-api/
│
├── src/
│   ├── config/
│   │   └── database.js          # Configuración de MongoDB
│   │
│   ├── models/
│   │   └── Proyecto.js          # Modelo/Esquema de Proyecto
│   │
│   ├── controllers/
│   │   └── proyectoController.js # Lógica de negocio
│   │
│   ├── routes/
│   │   └── proyectoRoutes.js    # Definición de rutas
│   │
│   └── app.js                   # Configuración de Express
│
├── .env                         # Variables de entorno
├── .gitignore                   # Archivos ignorados
├── server.js                    # Punto de entrada
├── package.json                 # Dependencias
└── README.md                    # Documentación
```

## 🔌 Endpoints

### Base URL
```
http://localhost:3000/api/proyectos
```

### Listado de Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/proyectos` | Obtener todos los proyectos |
| GET | `/api/proyectos/:id` | Obtener un proyecto por ID |
| POST | `/api/proyectos` | Crear un nuevo proyecto |
| PUT | `/api/proyectos/:id` | Actualizar un proyecto |
| DELETE | `/api/proyectos/:id` | Eliminar un proyecto |
| GET | `/api/proyectos/estado/:estado` | Filtrar proyectos por estado |
| GET | `/api/proyectos/categoria/:categoria` | Filtrar proyectos por categoría |

## 📝 Ejemplos de Uso

### 1. Obtener todos los proyectos

**Request:**
```http
GET http://localhost:3000/api/proyectos
```

**Response:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "67123abc...",
      "titulo": "Construcción Edificio Corporativo",
      "ubicacion": "Ciudad de México",
      "estado": "En Proceso",
      ...
    }
  ]
}
```

---

### 2. Obtener proyecto por ID

**Request:**
```http
GET http://localhost:3000/api/proyectos/67123abc...
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "67123abc...",
    "titulo": "Construcción Edificio Corporativo",
    "ubicacion": "Ciudad de México",
    "categoria": "Industrial",
    "estado": "En Proceso",
    "cliente": "Empresa XYZ",
    ...
  }
}
```

---

### 3. Crear un proyecto

**Request:**
```http
POST http://localhost:3000/api/proyectos
Content-Type: application/json
```

**Body:**
```json
{
  "titulo": "Construcción Edificio Corporativo Centro",
  "ubicacion": "Ciudad de México, CDMX",
  "fecha": "2025-01-15",
  "categoria": "Industrial",
  "estado": "En Proceso",
  "cliente": "Grupo Empresarial XYZ S.A. de C.V.",
  "duracion": "8 meses",
  "area": "3,500 m²",
  "equipo": "20 especialistas en construcción",
  "urlImagen": "https://images.unsplash.com/photo-1541888946425-d81bb19240f5",
  "descripcionCorta": "Proyecto de construcción de edificio corporativo de 15 pisos.",
  "descripcionCompleta": "Desarrollo completo de edificio corporativo con tecnología sustentable...",
  "desafios": "Construcción en zona urbana con tráfico denso...",
  "soluciones": "Implementación de horarios nocturnos para trabajos pesados...",
  "resultados": "Proyecto avanzando según cronograma...",
  "productosUtilizados": "Concreto premezclado alta resistencia, acero estructural..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Proyecto creado exitosamente",
  "data": {
    "_id": "67123abc...",
    "titulo": "Construcción Edificio Corporativo Centro",
    ...
  }
}
```

---

### 4. Actualizar un proyecto

**Request:**
```http
PUT http://localhost:3000/api/proyectos/67123abc...
Content-Type: application/json
```

**Body:**
```json
{
  "estado": "Completado",
  "resultados": "Proyecto finalizado exitosamente con todos los objetivos cumplidos."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Proyecto actualizado exitosamente",
  "data": {
    "_id": "67123abc...",
    "estado": "Completado",
    "resultados": "Proyecto finalizado exitosamente...",
    ...
  }
}
```

---

### 5. Eliminar un proyecto

**Request:**
```http
DELETE http://localhost:3000/api/proyectos/67123abc...
```

**Response:**
```json
{
  "success": true,
  "message": "Proyecto eliminado exitosamente"
}
```

---

### 6. Filtrar por estado

**Request:**
```http
GET http://localhost:3000/api/proyectos/estado/En Proceso
```

**Response:**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "_id": "67123abc...",
      "titulo": "Proyecto A",
      "estado": "En Proceso",
      ...
    }
  ]
}
```

---

### 7. Filtrar por categoría

**Request:**
```http
GET http://localhost:3000/api/proyectos/categoria/Industrial
```

**Response:**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "67123abc...",
      "titulo": "Proyecto Industrial",
      "categoria": "Industrial",
      ...
    }
  ]
}
```

## 📊 Modelo de Datos

### Proyecto Schema

```javascript
{
  titulo: String (requerido),
  ubicacion: String (requerido),
  fecha: Date (default: Date.now),
  categoria: String (requerido),
  estado: String (enum: ['En Proceso', 'Completado', 'Pendiente', 'Cancelado']),
  cliente: String (requerido),
  duracion: String,
  area: String,
  equipo: String,
  urlImagen: String,
  descripcionCorta: String,
  descripcionCompleta: String,
  desafios: String,
  soluciones: String,
  resultados: String,
  productosUtilizados: String,
  timestamps: true (createdAt, updatedAt)
}
```

### Campos Requeridos

- `titulo` - Título del proyecto
- `ubicacion` - Ubicación del proyecto
- `categoria` - Categoría (Industrial, Residencial, Comercial, etc.)
- `cliente` - Nombre del cliente

### Estados Válidos

- `En Proceso` - Proyecto en desarrollo
- `Completado` - Proyecto finalizado
- `Pendiente` - Proyecto por iniciar
- `Cancelado` - Proyecto cancelado

## 🧪 Ejemplos Adicionales

### Proyecto Residencial

```json
{
  "titulo": "Complejo Residencial Las Palmas",
  "ubicacion": "Monterrey, Nuevo León",
  "fecha": "2024-11-20",
  "categoria": "Residencial",
  "estado": "Completado",
  "cliente": "Inmobiliaria Del Norte",
  "duracion": "12 meses",
  "area": "8,000 m²",
  "equipo": "35 trabajadores especializados",
  "urlImagen": "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00",
  "descripcionCorta": "Desarrollo de 48 unidades residenciales con amenidades completas.",
  "descripcionCompleta": "Complejo residencial moderno con alberca, gimnasio, áreas verdes.",
  "desafios": "Terreno irregular, gestión de servicios urbanos.",
  "soluciones": "Nivelación con muros de contención.",
  "resultados": "100% de unidades vendidas antes de la entrega.",
  "productosUtilizados": "Block de concreto, pisos de porcelanato."
}
```

### Proyecto Comercial

```json
{
  "titulo": "Centro Comercial Plaza Norte",
  "ubicacion": "Guadalajara, Jalisco",
  "categoria": "Comercial",
  "estado": "Pendiente",
  "cliente": "Inversiones Comerciales SA",
  "duracion": "10 meses",
  "area": "5,200 m²",
  "equipo": "28 especialistas",
  "descripcionCorta": "Remodelación y ampliación de centro comercial existente."
}
```

## 🐛 Manejo de Errores

La API devuelve respuestas consistentes en caso de error:

```json
{
  "success": false,
  "message": "Descripción del error",
  "error": "Detalles técnicos del error"
}
```

### Códigos de Estado HTTP

- `200` - OK (GET, PUT exitosos)
- `201` - Created (POST exitoso)
- `400` - Bad Request (datos inválidos)
- `404` - Not Found (recurso no encontrado)
- `500` - Internal Server Error (error del servidor)

## 📦 Scripts Disponibles

```json
{
  "start": "node server.js",
  "dev": "nodemon server.js"
}
```

- `npm start` - Inicia el servidor en modo producción
- `npm run dev` - Inicia el servidor en modo desarrollo con auto-reload

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/NuevaCaracteristica`)
3. Commit tus cambios (`git commit -m 'Agregar nueva característica'`)
4. Push a la rama (`git push origin feature/NuevaCaracteristica`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia ISC.

## 👤 Autor

Tu Nombre - [@tu_usuario](https://github.com/tu-usuario)

## 📞 Soporte

Si tienes alguna pregunta o problema, por favor abre un [issue](https://github.com/tu-usuario/api-gestion-proyectos/issues).

---

⭐️ Si este proyecto te fue útil, considera darle una estrella en GitHub
