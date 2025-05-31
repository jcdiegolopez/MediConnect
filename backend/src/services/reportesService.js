
const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

class ReportesService {
  async getPatientsByAgeGroup({ genero, clinicaId, alergia, minConsultas, fechaRegistroInicio, fechaRegistroFin }) {
    try {
      let where = 'WHERE 1=1';
      const params = [];
      let paramIndex = 1;

      if (genero) {
        where += ` AND p.genero = $${paramIndex++}`;
        params.push(genero);
      }
      if (clinicaId) {
        where += ` AND c.clinica_id = $${paramIndex++}`;
        params.push(parseInt(clinicaId));
      }
      if (alergia) {
        where += ` AND pa.alergia_id IN (SELECT id FROM public."Alergias" WHERE nombre_alergia ILIKE $${paramIndex++})`;
        params.push(`%${alergia}%`);
      }
      if (minConsultas) {
        where += ` AND (SELECT COUNT(*) FROM public."Consultas" c2 WHERE c2.paciente_id = p.id) >= $${paramIndex++}`;
        params.push(parseInt(minConsultas));
      }
      if (fechaRegistroInicio && fechaRegistroFin) {
        where += ` AND p.ultima_consulta::DATE BETWEEN $${paramIndex++} AND $${paramIndex++}`;
        params.push(fechaRegistroInicio, fechaRegistroFin);
      }

      const data = await prisma.$queryRawUnsafe(`
        SELECT 
          CASE 
            WHEN public.calcular_edad(p.fecha_nacimiento) < 18 THEN 'Menor de 18'
            WHEN public.calcular_edad(p.fecha_nacimiento) BETWEEN 18 AND 30 THEN '18-30'
            WHEN public.calcular_edad(p.fecha_nacimiento) BETWEEN 31 AND 50 THEN '31-50'
            ELSE 'Mayor de 50'
          END AS age_group,
          COUNT(p.id)::INTEGER AS patient_count
        FROM public."Pacientes" p
        LEFT JOIN public."Consultas" c ON p.id = c.paciente_id
        LEFT JOIN public."Pacientes_Alergias" pa ON p.id = pa.paciente_id
        ${where}
        GROUP BY age_group
        ORDER BY age_group
      `, ...params);

      return data.map(row => ({
        age_group: row.age_group,
        patient_count: Number(row.patient_count)
      }));
    } catch (error) {
      throw new Error(`Error fetching patients by age group: ${error.message}`);
    }
  }

  async getDoctorConsultationCounts({ especialidadId, clinicaId, fechaInicio, fechaFin, diagnostico, minConsultas }) {
    try {
      const doctors = await prisma.doctores.findMany({
        where: {
          ...(especialidadId && { especialidad_id: parseInt(especialidadId) }),
          ...(clinicaId && { clinicas: { some: { clinica_id: parseInt(clinicaId) } } })
        },
        select: { id: true, nombre: true, apellido: true }
      });

      const data = [];
      for (const doctor of doctors) {
        let consultaCount = await prisma.$queryRaw`
          SELECT public.contar_consultas_doctor(
            ${doctor.id}::INTEGER,
            ${fechaInicio || '2025-01-01'}::DATE,
            ${fechaFin || '2025-12-31'}::DATE
          ) AS result
        `;
        consultaCount = Number(consultaCount[0].result);

        if (minConsultas && consultaCount < parseInt(minConsultas)) continue;

        const consultations = await prisma.consultas.findMany({
          where: {
            doctor_id: doctor.id,
            fecha: { gte: new Date(fechaInicio || '2025-01-01'), lte: new Date(fechaFin || '2025-12-31') },
            ...(diagnostico && { diagnostico: { contains: diagnostico, mode: 'insensitive' } })
          }
        });

        if (consultations.length > 0) {
          data.push({
            doctor: `${doctor.nombre} ${doctor.apellido}`,
            consultations: consultaCount
          });
        }
      }

      return data;
    } catch (error) {
      throw new Error(`Error fetching doctor consultations: ${error.message}`);
    }
  }

  async getClinicActivity({ clinicaId, fechaInicio, fechaFin, especialidadId, genero, diagnostico }) {
    try {
        let where = 'WHERE 1=1';
        const params = [];
        let paramIndex = 1;

        let fechaInicioIndex = null;
        let fechaFinIndex = null;

        if (clinicaId) {
        where += ` AND c.clinica_id = $${paramIndex++}`;
        params.push(parseInt(clinicaId));
        }
        if (fechaInicio && fechaFin) {
        fechaInicioIndex = paramIndex;
        fechaFinIndex = paramIndex + 1;
        where += ` AND c.fecha::DATE BETWEEN $${fechaInicioIndex} AND $${fechaFinIndex}`;
        params.push(fechaInicio, fechaFin);
        paramIndex += 2;
        }
        if (especialidadId) {
        where += ` AND d.especialidad_id = $${paramIndex++}`;
        params.push(parseInt(especialidadId));
        }
        if (genero) {
        where += ` AND p.genero = $${paramIndex++}`;
        params.push(genero);
        }
        if (diagnostico) {
        where += ` AND c.diagnostico ILIKE $${paramIndex++}`;
        params.push(`%${diagnostico}%`);
        }

        const totalConsultationsSQL = (fechaInicioIndex && fechaFinIndex)
        ? `SUM(public.contar_consultas_doctor(d.id, $${fechaInicioIndex}, $${fechaFinIndex}))::INTEGER AS total_consultations`
        : `0 AS total_consultations`;

        const data = await prisma.$queryRawUnsafe(`
        SELECT 
            cl.nombre AS clinica,
            AVG(public.calcular_edad(p.fecha_nacimiento))::INTEGER AS avg_patient_age,
            ${totalConsultationsSQL}
        FROM public."Consultas" c
        JOIN public."Pacientes" p ON c.paciente_id = p.id
        JOIN public."Doctores" d ON c.doctor_id = d.id
        JOIN public."Clinicas" cl ON c.clinica_id = cl.id
        ${where}
        GROUP BY cl.nombre
        ORDER BY total_consultations DESC
        `, ...params);

        return data.map(row => ({
        clinica: row.clinica,
        avg_patient_age: Number(row.avg_patient_age),
        total_consultations: Number(row.total_consultations)
        }));
    } catch (error) {
        throw new Error(`Error fetching clinic activity: ${error.message}`);
    }
    }

}

module.exports = new ReportesService();
