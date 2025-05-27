
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

  async getAllConsultas() {
    return await prisma.consultas.findMany({
      include: {
        paciente: { select: { nombre: true, apellido: true } },
        doctor: { select: { nombre: true, apellido: true } },
        clinica: { select: { nombre: true } },
        recetas: { include: { medicamento: true } },
      },
    });
  }

  async getConsultaById(id) {
    const consulta = await prisma.consultas.findUnique({
      where: { id: parseInt(id) },
      include: {
        paciente: { select: { nombre: true, apellido: true } },
        doctor: { select: { nombre: true, apellido: true } },
        clinica: { select: { nombre: true } },
        recetas: { include: { medicamento: true } },
      },
    });
    if (!consulta) throw new Error('Consulta no encontrada');
    return consulta;
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
