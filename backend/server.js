
const express = require('express');
const cors = require('cors');
const citasRoutes = require('./src/routes/citasRoutes');
const pacientesRoutes = require('./src/routes/pacientesRoutes');
const consultasRoutes = require('./src/routes/consultasRoutes');
const reportesRoutes = require('./src/routes/reportesRoutes');
const errorHandler = require('./src/middleware/errorHandler');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/citas', citasRoutes);
app.use('/api/pacientes', pacientesRoutes);
app.use('/api/consultas', consultasRoutes);
app.use('/api/reportes', reportesRoutes);

// Manejo de errores
app.use(errorHandler);

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});