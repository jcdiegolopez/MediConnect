
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const validateRequest = require('../middleware/validateRequest');
const reportesController = require('../controllers/reportesController');

router.get(
  '/consultas-por-especialidad',
  [
    check('fechaInicio')
      .optional()
      .matches(/^\d{4}-\d{2}-\d{2}$/)
      .withMessage('Fecha de inicio debe ser YYYY-MM-DD')
      .custom((value) => {
        if (!new Date(value).getTime()) throw new Error('Fecha de inicio inválida');
        return true;
      }),
    check('fechaFin')
      .optional()
      .matches(/^\d{4}-\d{2}-\d{2}$/)
      .withMessage('Fecha de fin debe ser YYYY-MM-DD')
      .custom((value) => {
        if (!new Date(value).getTime()) throw new Error('Fecha de fin inválida');
        return true;
      }),
    check('especialidadId').optional().isInt({ min: 1 }).withMessage('Especialidad ID debe ser un entero positivo'),
    check('clinicaId').optional().isInt({ min: 1 }).withMessage('Clínica ID debe ser un entero positivo'),
    check('doctorId').optional().isInt({ min: 1 }).withMessage('Doctor ID debe ser un entero positivo'),
    check('diagnostico').optional().notEmpty().withMessage('Diagnóstico no puede estar vacío'),
    validateRequest,
  ],
  reportesController.consultasPorEspecialidad
);

router.get(
  '/facturacion-por-paciente',
  [
    check('fechaInicio')
      .optional()
      .matches(/^\d{4}-\d{2}-\d{2}$/)
      .withMessage('Fecha de inicio debe ser YYYY-MM-DD')
      .custom((value) => {
        if (!new Date(value).getTime()) throw new Error('Fecha de inicio inválida');
        return true;
      }),
    check('fechaFin')
      .optional()
      .matches(/^\d{4}-\d{2}-\d{2}$/)
      .withMessage('Fecha de fin debe ser YYYY-MM-DD')
      .custom((value) => {
        if (!new Date(value).getTime()) throw new Error('Fecha de fin inválida');
        return true;
      }),
    check('pacienteId').optional().isInt({ min: 1 }).withMessage('Paciente ID debe ser un entero positivo'),
    check('tipoItem').optional().isIn(['Consulta', 'Examen']).withMessage('Tipo de ítem debe ser Consulta o Examen'),
    check('montoMin').optional().isFloat({ min: 0 }).withMessage('Monto mínimo debe ser un número positivo'),
    check('montoMax').optional().isFloat({ min: 0 }).withMessage('Monto máximo debe ser un número positivo'),
    check('clinicaId').optional().isInt({ min: 1 }).withMessage('Clínica ID debe ser un entero positivo'),
    validateRequest,
  ],
  reportesController.facturacionPorPaciente
);

router.get(
  '/examenes-costos-por-tipo',
  [
    check('fechaInicio')
      .optional()
      .matches(/^\d{4}-\d{2}-\d{2}$/)
      .withMessage('Fecha de inicio debe ser YYYY-MM-DD')
      .custom((value) => {
        if (!new Date(value).getTime()) throw new Error('Fecha de inicio inválida');
        return true;
      }),
    check('fechaFin')
      .optional()
      .matches(/^\d{4}-\d{2}-\d{2}$/)
      .withMessage('Fecha de fin debe ser YYYY-MM-DD')
      .custom((value) => {
        if (!new Date(value).getTime()) throw new Error('Fecha de fin inválida');
        return true;
      }),
    check('tipoExamenId').optional().isInt({ min: 1 }).withMessage('Tipo de examen ID debe ser un entero positivo'),
    check('clinicaId').optional().isInt({ min: 1 }).withMessage('Clínica ID debe ser un entero positivo'),
    check('pacienteId').optional().isInt({ min: 1 }).withMessage('Paciente ID debe ser un entero positivo'),
    check('costoMin').optional().isFloat({ min: 0 }).withMessage('Costo mínimo debe ser un número positivo'),
    check('costoMax').optional().isFloat({ min: 0 }).withMessage('Costo máximo debe ser un número positivo'),
    validateRequest,
  ],
  reportesController.examenesCostosPorTipo
);

module.exports = router;
