const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const validateRequest = require('../middleware/validateRequest');
const pacientesController = require('../controllers/pacientesController');

router.post(
  '/',
  [
    check('nombre').notEmpty().withMessage('Nombre es obligatorio'),
    check('apellido').notEmpty().withMessage('Apellido es obligatorio'),
    check('fecha_nacimiento')
      .isISO8601()
      .withMessage('Fecha de nacimiento debe ser una fecha válida')
      .custom((value) => {
        const fecha = new Date(value);
        const now = new Date();
        if (fecha >= now) throw new Error('Fecha de nacimiento debe ser en el pasado');
        return true;
      }),
    check('correo')
      .isEmail()
      .withMessage('Correo debe tener un formato válido (ej. usuario@dominio.com)'),
    check('genero')
      .optional()
      .isIn(['M', 'F', 'Otro'])
      .withMessage('Género debe ser M, F u Otro'),
    check('telefono').optional().notEmpty().withMessage('Teléfono no puede estar vacío'),
    validateRequest,
  ],
  pacientesController.createPaciente
);

router.get('/', pacientesController.getAllPacientes);

router.get(
  '/:id',
  [check('id').isInt({ min: 1 }).withMessage('ID debe ser un entero positivo'), validateRequest],
  pacientesController.getPacienteById
);

router.put(
  '/:id',
  [
    check('id').isInt({ min: 1 }).withMessage('ID debe ser un entero positivo'),
    check('nombre').optional().notEmpty().withMessage('Nombre no puede estar vacío'),
    check('apellido').optional().notEmpty().withMessage('Apellido no puede estar vacío'),
    check('fecha_nacimiento')
      .optional()
      .isISO8601()
      .custom((value) => {
        const fecha = new Date(value);
        const now = new Date();
        if (fecha >= now) throw new Error('Fecha de nacimiento debe ser en el pasado');
        return true;
      }),
    check('correo').optional().isEmail().withMessage('Correo debe tener un formato válido'),
    check('genero')
      .optional()
      .isIn(['M', 'F', 'Otro'])
      .withMessage('Género debe ser M, F u Otro'),
    check('telefono').optional().notEmpty().withMessage('Teléfono no puede estar vacío'),
    validateRequest,
  ],
  pacientesController.updatePaciente
);

router.delete(
  '/:id',
  [check('id').isInt({ min: 1 }).withMessage('ID debe ser un entero positivo'), validateRequest],
  pacientesController.deletePaciente
);

module.exports = router;
