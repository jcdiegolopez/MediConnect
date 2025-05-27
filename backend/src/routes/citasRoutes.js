
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const validateRequest = require('../middleware/validateRequest');
const citasController = require('../controllers/citasController');

router.post(
  '/',
  [
    check('paciente_id').isInt({ min: 1 }).withMessage('Paciente ID debe ser un entero positivo'),
    check('doctor_id').isInt({ min: 1 }).withMessage('Doctor ID debe ser un entero positivo'),
    check('clinica_id').isInt({ min: 1 }).withMessage('Clínica ID debe ser un entero positivo'),
    check('fecha')
      .isISO8601()
      .custom((value) => {
        const fecha = new Date(value);
        const now = new Date();
        if (fecha <= now) throw new Error('La fecha debe ser futura');
        const hour = fecha.getHours();
        if (hour < 8 || hour > 18) throw new Error('La cita debe ser entre 8 AM y 6 PM');
        return true;
      }),
    check('estado')
      .isIn(['Programada', 'Completada', 'Cancelada'])
      .withMessage('Estado inválido'),
    validateRequest,
  ],
  citasController.createCita
);

router.get('/', citasController.getAllCitas);

router.get(
  '/:id',
  [check('id').isInt({ min: 1 }).withMessage('ID debe ser un entero positivo'), validateRequest],
  citasController.getCitaById
);

router.put(
  '/:id',
  [
    check('id').isInt({ min: 1 }).withMessage('ID debe ser un entero positivo'),
    check('paciente_id')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Paciente ID debe ser un entero positivo'),
    check('doctor_id')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Doctor ID debe ser un entero positivo'),
    check('clinica_id')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Clínica ID debe ser un entero positivo'),
    check('fecha')
      .optional()
      .isISO8601()
      .custom((value) => {
        const fecha = new Date(value);
        const now = new Date();
        if (fecha <= now) throw new Error('La fecha debe ser futura');
        const hour = fecha.getHours();
        if (hour < 8 || hour > 18) throw new Error('La cita debe ser entre 8 AM y 6 PM');
        return true;
      }),
    check('estado')
      .optional()
      .isIn(['Programada', 'Completada', 'Cancelada'])
      .withMessage('Estado inválido'),
    validateRequest,
  ],
  citasController.updateCita
);

router.delete(
  '/:id',
  [check('id').isInt({ min: 1 }).withMessage('ID debe ser un entero positivo'), validateRequest],
  citasController.deleteCita
);

module.exports = router;