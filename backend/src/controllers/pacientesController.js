
const pacientesService = require('../services/pacientesService');

class PacientesController {
  async createPaciente(req, res) {
    try {
      const paciente = await pacientesService.createPaciente(req.body);
      res.status(201).json(paciente);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getAllPacientes(req, res) {
    try {
      const pacientes = await pacientesService.getAllPacientes();
      console.log(pacientes)
      res.json(pacientes);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getPacienteById(req, res) {
    try {
      const paciente = await pacientesService.getPacienteById(req.params.id);
      res.json(paciente);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async updatePaciente(req, res) {
    try {
      const paciente = await pacientesService.updatePaciente(req.params.id, req.body);
      res.json(paciente);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async deletePaciente(req, res) {
    try {
      await pacientesService.deletePaciente(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new PacientesController();
