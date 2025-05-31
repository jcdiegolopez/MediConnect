
const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

class PacientesService {
  async createPaciente(data) {
    try {
      const paciente = await prisma.pacientes.create({ data });
      return paciente;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new Error('Correo ya registrado');
      }
      throw error;
    }
  }

  async getAllPacientes() {
    try {
      const pacientes = await prisma.vistaPacientes.findMany();
      return pacientes;
    } catch (error) {
      throw new Error(`Error al obtener pacientes: ${error.message}`);
    }
  }

  async getPacienteById(id) {
  try {
    const paciente = await prisma.vistaPacientes.findUnique({
      where: { id: parseInt(id) },
    });
    if (!paciente) throw new Error('Paciente no encontrado');
    return paciente;
  } catch (error) {
    throw new Error(`Error al obtener paciente: ${error.message}`);
  }
}

  async updatePaciente(id, data) {
    try {
      const paciente = await prisma.pacientes.update({
        where: { id: parseInt(id) },
        data,
      });
      return paciente;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new Error('Paciente no encontrado');
      }
      if (error.code === 'P2002') {
        throw new Error('Correo ya registrado');
      }
      throw error;
    }
  }

  async deletePaciente(id) {
    try {
      await prisma.pacientes.delete({
        where: { id: parseInt(id) },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new Error('Paciente no encontrado');
      }
      if (error.code === 'P2003') {
        throw new Error('No se puede eliminar: paciente tiene citas o consultas asociadas');
      }
      throw error;
    }
  }
}

module.exports = new PacientesService();
