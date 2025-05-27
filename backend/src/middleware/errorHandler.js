const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  if (err.name === 'PrismaClientKnownRequestError') {
    if (err.code === 'P2002') {
      return res.status(400).json({ error: 'Registro duplicado' });
    }
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Recurso no encontrado' });
    }
  }
  res.status(500).json({ error: 'Error interno del servidor' });
};

module.exports = errorHandler;