const citasService = require('../services/citasService');

class CitasController {
  async createCita(req, res) {
    try {
      const cita = await citasService.createCita(req.body);
      res.status(201).json(cita);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getAllCitas(req, res) {
    try {
      const filters = req.query;
      const citas = await citasService.getAllCitas(filters);
      res.json(citas);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getCitaById(req, res) {
    try {
      const cita = await citasService.getCitaById(req.params.id);
      res.json(cita);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async updateCita(req, res) {
    try {
      const cita = await citasService.updateCita(req.params.id, req.body);
      res.json(cita);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async deleteCita(req, res) {
    try {
      await citasService.deleteCita(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }
}

module.exports = new CitasController();
