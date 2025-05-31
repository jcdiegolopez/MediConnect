const consultasService = require('../services/consultasService');

class ConsultasController {
  async createConsulta(req, res) {
    try {
      const consulta = await consultasService.createConsulta(req.body);
      res.status(201).json(consulta);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getAllConsultas(req, res) {
    try {
      const consultas = await consultasService.getAllConsultas(req.query);
      res.json(consultas);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getConsultaById(req, res) {
    try {
      const consulta = await consultasService.getConsultaById(req.params.id);
      res.json(consulta);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async updateConsulta(req, res) {
    try {
      const consulta = await consultasService.updateConsulta(req.params.id, req.body);
      res.json(consulta);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async deleteConsulta(req, res) {
    try {
      await consultasService.deleteConsulta(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new ConsultasController();
