
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const validateRequest = require('../middleware/validateRequest');
const consultasController = require('../controllers/consultasController');

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
        return true;
      }),
    check('diagnostico').notEmpty().withMessage('Diagnóstico es obligatorio'),
    check('notas')
      .isObject()
      .withMessage('Notas debe ser un objeto JSON')
      .custom((value) => {
        if (!value.observaciones || !value.sintomas || !value.recomendaciones) {
          throw new Error('Notas debe incluir observaciones, sintomas y recomendaciones');
        }
        return true;
      }),
    validateRequest,
  ],
  consultasController.createConsulta
);

router.get('/', consultasController.getAllConsultas);

router.get(
  '/:id',
  [check('id').isInt({ min: 1 }).withMessage('ID debe ser un entero positivo'), validateRequest],
  consultasController.getConsultaById
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
        return true;
      }),
    check('diagnostico').optional().notEmpty().withMessage('Diagnóstico no puede estar vacío'),
    check('notas')
      .optional()
      .isObject()
      .custom((value) => {
        if (!value.observaciones || !value.sintomas || !value.recomendaciones) {
          throw new Error('Notas debe incluir observaciones, sintomas y recomendaciones');
        }
        return true;
      }),
    validateRequest,
  ],
  consultasController.updateConsulta
);

router.delete(
  '/:id',
  [check('id').isInt({ min: 1 }).withMessage('ID debe ser un entero positivo'), validateRequest],
  consultasController.deleteConsulta
);

module.exports = router;
