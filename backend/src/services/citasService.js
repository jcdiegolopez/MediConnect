
const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

class CitasService {
  async createCita(data) {
    try {
      const cita = await prisma.citas.create({ data });
      return cita;
    } catch (error) {
      if (error.code === 'P2003') {
        throw new Error('ID de paciente, doctor o clínica no válido');
      }
      throw error;
    }
  }

  async getAllCitas(filters = {}) {
    try {
      const where = {};
      console.log('Filters:', filters);
      if (filters.pacienteId) where.paciente_id = parseInt(filters.pacienteId);
      if (filters.doctorId) where.doctor_id = parseInt(filters.doctorId);
      if (filters.estado) where.estado = filters.estado;

      return await prisma.vistaCitas.findMany({ where });
    } catch (error) {
      throw new Error(`Error al obtener citas: ${error.message}`);
    }
  }

  async getCitaById(id) {
    try {
      const cita = await prisma.vistaCitas.findUnique({
        where: { id: parseInt(id) },
      });
      if (!cita) throw new Error('Cita no encontrada');
      return cita;
    } catch (error) {
      throw new Error(`Error al obtener cita: ${error.message}`);
    }
  }

  async updateCita(id, data) {
    try {
      const cita = await prisma.citas.update({
        where: { id: parseInt(id) },
        data,
      });
      return cita;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new Error('Cita no encontrada');
      }
      throw error;
    }
  }

  async deleteCita(id) {
    try {
      await prisma.citas.delete({
        where: { id: parseInt(id) },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new Error('Cita no encontrada');
      }
      throw error;
    }
  }
}

module.exports = new CitasService();
