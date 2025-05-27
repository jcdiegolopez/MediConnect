
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
    return await prisma.$queryRaw`
      SELECT id, nombre, apellido, fecha_nacimiento,
             calcular_edad(fecha_nacimiento) AS edad,
             (SELECT COUNT(*) FROM public."Historiales_Medicos" h WHERE h.paciente_id = p.id) AS historiales,
             (SELECT STRING_AGG(a.nombre_alergia, ', ')
              FROM public."Pacientes_Alergias" pa
              JOIN public."Alergias" a ON pa.alergia_id = a.id
              WHERE pa.paciente_id = p.id) AS alergias
      FROM public."Pacientes" p
    `;
  }

  async getPacienteById(id) {
    const paciente = await prisma.$queryRaw`
      SELECT id, nombre, apellido, fecha_nacimiento,
             calcular_edad(fecha_nacimiento) AS edad,
             (SELECT COUNT(*) FROM public."Historiales_Medicos" h WHERE h.paciente_id = p.id) AS historiales,
             (SELECT STRING_AGG(a.nombre_alergia, ', ')
              FROM public."Pacientes_Alergias" pa
              JOIN public."Alergias" a ON pa.alergia_id = a.id
              WHERE pa.paciente_id = p.id) AS alergias
      FROM public."Pacientes" p
      WHERE p.id = ${parseInt(id)}
    `;
    if (!paciente.length) throw new Error('Paciente no encontrado');
    return paciente[0];
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
