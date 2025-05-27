
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
    const where = {};
    if (filters.pacienteId) where.paciente_id = parseInt(filters.pacienteId);
    if (filters.doctorId) where.doctor_id = parseInt(filters.doctorId);
    if (filters.estado) where.estado = filters.estado;

    return await prisma.citas.findMany({
      where,
      include: {
        paciente: { select: { nombre: true, apellido: true } },
        doctor: { select: { nombre: true, apellido: true } },
        clinica: { select: { nombre: true } },
      },
    });
  }

  async getCitaById(id) {
    const cita = await prisma.citas.findUnique({
      where: { id: parseInt(id) },
      include: {
        paciente: { select: { nombre: true, apellido: true } },
        doctor: { select: { nombre: true, apellido: true } },
        clinica: { select: { nombre: true } },
      },
    });
    if (!cita) throw new Error('Cita no encontrada');
    return cita;
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
