
const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

class ConsultasService {
  async createConsulta(data) {
    try {
      const consulta = await prisma.consultas.create({
        data,
        include: {
          recetas: { include: { medicamento: true } },
        },
      });
      return consulta;
    } catch (error) {
      if (error.code === 'P2003') {
        throw new Error('ID de paciente, doctor o clínica no válido');
      }
      throw error;
    }
  }

  async getAllConsultas(filters = {}) {
    try {
      const where = {};
      console.log('Filters:', filters);
      if (filters.pacienteId) where.paciente_id = parseInt(filters.pacienteId);
      if (filters.doctorId) where.doctor_id = parseInt(filters.doctorId);

      return await prisma.vistaConsultas.findMany({ where });
    } catch (error) {
      throw new Error(`Error al obtener consultas: ${error.message}`);
    }
  }

  async getConsultaById(id) {
    try {
      const consulta = await prisma.vistaConsultas.findUnique({
        where: { id: parseInt(id) },
      });
      if (!consulta) throw new Error('Consulta no encontrada');
      return consulta;
    } catch (error) {
      throw new Error(`Error al obtener consulta: ${error.message}`);
    }
  }

  async updateConsulta(id, data) {
    try {
      const consulta = await prisma.consultas.update({
        where: { id: parseInt(id) },
        data,
        include: {
          recetas: { include: { medicamento: true } },
        },
      });
      return consulta;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new Error('Consulta no encontrada');
      }
      throw error;
    }
  }

  async deleteConsulta(id) {
    try {
      await prisma.consultas.delete({
        where: { id: parseInt(id) },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new Error('Consulta no encontrada');
      }
      if (error.code === 'P2003') {
        throw new Error('No se puede eliminar: consulta tiene recetas asociadas');
      }
      throw error;
    }
  }
}

module.exports = new ConsultasService();
