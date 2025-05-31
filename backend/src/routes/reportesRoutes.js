
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const validateRequest = require('../middleware/validateRequest');
const ReportesController = require('../controllers/reportesController');

router.get(
  '/patients-by-age-group',
  [
    check('genero').optional().isIn(['M', 'F']).withMessage('Género debe ser M o F'),
    check('clinicaId').optional().isInt({ min: 1 }).withMessage('Clínica ID debe ser un entero positivo'),
    check('alergia').optional().notEmpty().withMessage('Alergia no puede estar vacía'),
    check('minConsultas').optional().isInt({ min: 0 }).withMessage('Mínimo de consultas debe ser un entero no negativo'),
    check('fechaRegistroInicio')
      .optional()
      .matches(/^\d{4}-\d{2}-\d{2}$/)
      .withMessage('Fecha de registro inicio debe ser YYYY-MM-DD'),
    check('fechaRegistroFin')
      .optional()
      .matches(/^\d{4}-\d{2}-\d{2}$/)
      .withMessage('Fecha de registro fin debe ser YYYY-MM-DD'),
    validateRequest
  ],
  ReportesController.patientsByAgeGroup
);

router.get(
  '/doctor-consultation-counts',
  [
    check('especialidadId').optional().isInt({ min: 1 }).withMessage('Especialidad ID debe ser un entero positivo'),
    check('clinicaId').optional().isInt({ min: 1 }).withMessage('Clínica ID debe ser un entero positivo'),
    check('fechaInicio')
      .optional()
      .matches(/^\d{4}-\d{2}-\d{2}$/)
      .withMessage('Fecha de inicio debe ser YYYY-MM-DD'),
    check('fechaFin')
      .optional()
      .matches(/^\d{4}-\d{2}-\d{2}$/)
      .withMessage('Fecha de fin debe ser YYYY-MM-DD'),
    check('diagnostico').optional().notEmpty().withMessage('Diagnóstico no puede estar vacío'),
    check('minConsultas').optional().isInt({ min: 0 }).withMessage('Mínimo de consultas debe ser un entero no negativo'),
    validateRequest
  ],
  ReportesController.doctorConsultationCounts
);

router.get(
  '/clinic-activity',
  [
    check('clinicaId').optional().isInt({ min: 1 }).withMessage('Clínica ID debe ser un entero positivo'),
    check('fechaInicio')
      .optional()
      .matches(/^\d{4}-\d{2}-\d{2}$/)
      .withMessage('Fecha de inicio debe ser YYYY-MM-DD'),
    check('fechaFin')
      .optional()
      .matches(/^\d{4}-\d{2}-\d{2}$/)
      .withMessage('Fecha de fin debe ser YYYY-MM-DD'),
    check('especialidadId').optional().isInt({ min: 1 }).withMessage('Especialidad ID debe ser un entero positivo'),
    check('genero').optional().isIn(['Masculino', 'Femenino']).withMessage('Género debe ser Masculino o Femenino'),
    check('diagnostico').optional().notEmpty().withMessage('Diagnóstico no puede estar vacío'),
    validateRequest
  ],
  ReportesController.clinicActivity
);

module.exports = router;
