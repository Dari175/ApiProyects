require('dotenv').config();
const app = require('./src/app');
console.log('MONGODB_URI:', process.env.MONGODB_URI); // Para debug

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`📍 http://localhost:${PORT}`);
});