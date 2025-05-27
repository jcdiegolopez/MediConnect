
const { PrismaClient } = require('../generated/prisma');
const { Parser } = require('json2csv');
const prisma = new PrismaClient();

class ReportesController {
  async consultasPorEspecialidad(req, res) {
    const { fechaInicio, fechaFin, especialidadId, clinicaId, doctorId, diagnostico } = req.query;
    
    // Default dates if not provided
    const defaultFechaInicio = '2025-01-01';
    const defaultFechaFin = '2025-12-31';
    
    // Validate dates
    const isValidDate = (dateStr) => {
      if (!dateStr) return false;
      const date = new Date(dateStr);
      return !isNaN(date.getTime()) && dateStr.match(/^\d{4}-\d{2}-\d{2}/);
    };
    
    const startDate = isValidDate(fechaInicio) ? fechaInicio : defaultFechaInicio;
    const endDate = isValidDate(fechaFin) ? fechaFin : defaultFechaFin;

    let where = 'WHERE c.fecha BETWEEN $1::TIMESTAMP AND $2::TIMESTAMP';
    const params = [startDate, endDate];
    let paramIndex = 3;

    if (especialidadId) {
      where += ` AND e.id = $${paramIndex++}`;
      params.push(parseInt(especialidadId));
    }
    if (clinicaId) {
      where += ` AND c.clinica_id = $${paramIndex++}`;
      params.push(parseInt(clinicaId));
    }
    if (doctorId) {
      where += ` AND c.doctor_id = $${paramIndex++}`;
      params.push(parseInt(doctorId));
    }
    if (diagnostico) {
      where += ` AND c.diagnostico ILIKE $${paramIndex++}`;
      params.push(`%${diagnostico}%`);
    }

    try {
      const data = await prisma.$queryRawUnsafe(`
        SELECT e.nombre AS especialidad, COUNT(c.id)::INTEGER AS consultas
        FROM public."Consultas" c
        JOIN public."Doctores" d ON c.doctor_id = d.id
        JOIN public."Especialidades" e ON d.especialidad_id = e.id
        ${where}
        GROUP BY e.nombre
        ORDER BY consultas DESC
      `, ...params);

      // Transform data to ensure BigInt is converted to Number
      const serializedData = data.map(row => ({
        especialidad: row.especialidad,
        consultas: Number(row.consultas)
      }));

      const chart = {
        type: 'bar',
        data: {
          labels: serializedData.map(row => row.especialidad),
          datasets: [{
            label: 'Consultas por Especialidad',
            data: serializedData.map(row => row.consultas),
            backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56', '#4BC0C0', '#9966FF'],
          }],
        },
        options: {
          responsive: true,
          scales: {
            y: { beginAtZero: true, title: { display: true, text: 'Número de Consultas' } },
            x: { title: { display: true, text: 'Especialidad' } },
          },
        },
      };

      if (req.query.format === 'csv') {
        const parser = new Parser();
        const csv = parser.parse(serializedData);
        res.header('Content-Type', 'text/csv');
        res.attachment('consultas_por_especialidad.csv');
        return res.send(csv);
      }

      res.json({ data: serializedData, chart });
    } catch (error) {
      console.error('Error en consultasPorEspecialidad:', error);
      res.status(500).json({ error: 'Error al generar el reporte', details: error.message });
    }
  }

  async facturacionPorPaciente(req, res) {
    const { fechaInicio, fechaFin, pacienteId, tipoItem, montoMin, montoMax, clinicaId } = req.query;
    const defaultFechaInicio = '2025-01-01';
    const defaultFechaFin = '2025-12-31';
    
    const isValidDate = (dateStr) => {
      if (!dateStr) return false;
      const date = new Date(dateStr);
      return !isNaN(date.getTime()) && dateStr.match(/^\d{4}-\d{2}-\d{2}/);
    };
    
    const startDate = isValidDate(fechaInicio) ? fechaInicio : defaultFechaInicio;
    const endDate = isValidDate(fechaFin) ? fechaFin : defaultFechaFin;

    let where = 'WHERE f.fecha BETWEEN $1::TIMESTAMP AND $2::TIMESTAMP';
    const params = [startDate, endDate];
    let paramIndex = 3;

    if (pacienteId) {
      where += ` AND f.paciente_id = $${paramIndex++}`;
      params.push(parseInt(pacienteId));
    }
    if (tipoItem) {
      where += ` AND fi.tipo_item = $${paramIndex++}`;
      params.push(tipoItem);
    }
    if (montoMin) {
      where += ` AND f.monto >= $${paramIndex++}`;
      params.push(parseFloat(montoMin));
    }
    if (montoMax) {
      where += ` AND f.monto <= $${paramIndex++}`;
      params.push(parseFloat(montoMax));
    }
    if (clinicaId) {
      where += ` AND (c.clinica_id = $${paramIndex} OR em.clinica_id = $${paramIndex})`;
      params.push(parseInt(clinicaId));
      paramIndex++;
    }

    try {
      const data = await prisma.$queryRawUnsafe(`
        SELECT f.id, f.fecha, f.monto, p.nombre || ' ' || p.apellido AS paciente,
               STRING_AGG(fi.tipo_item || ': $' || fi.costo, ', ') AS items
        FROM public."Facturas" f
        JOIN public."Pacientes" p ON f.paciente_id = p.id
        LEFT JOIN public."Facturas_Items" fi ON f.id = fi.factura_id
        LEFT JOIN public."Consultas" c ON fi.consulta_id = c.id
        LEFT JOIN public."Examenes_Medicos" em ON fi.examen_id = em.id
        ${where}
        GROUP BY f.id, f.fecha, f.monto, p.nombre, p.apellido
        ORDER BY f.fecha DESC
      `, ...params);

      // Transform data to ensure BigInt is converted to Number
      const serializedData = data.map(row => ({
        id: Number(row.id),
        fecha: row.fecha.toISOString(),
        monto: Number(row.monto),
        paciente: row.paciente,
        items: row.items
      }));

      const chart = {
        type: 'pie',
        data: {
          labels: serializedData.map(row => row.paciente),
          datasets: [{
            label: 'Facturación por Paciente',
            data: serializedData.map(row => row.monto),
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
          }],
        },
        options: {
          responsive: true,
          plugins: { legend: { position: 'top' } },
        },
      };

      if (req.query.format === 'csv') {
        const parser = new Parser();
        const csv = parser.parse(serializedData);
        res.header('Content-Type', 'text/csv');
        res.attachment('facturacion_por_paciente.csv');
        return res.send(csv);
      }

      res.json({ data: serializedData, chart });
    } catch (error) {
      console.error('Error en facturacionPorPaciente:', error);
      res.status(500).json({ error: 'Error al generar el reporte', details: error.message });
    }
  }

  async examenesCostosPorTipo(req, res) {
    const { fechaInicio, fechaFin, tipoExamenId, clinicaId, pacienteId, costoMin, costoMax } = req.query;
    const defaultFechaInicio = '2025-01-01';
    const defaultFechaFin = '2025-12-31';
    
    const isValidDate = (dateStr) => {
      if (!dateStr) return false;
      const date = new Date(dateStr);
      return !isNaN(date.getTime()) && dateStr.match(/^\d{4}-\d{2}-\d{2}/);
    };
    
    const startDate = isValidDate(fechaInicio) ? fechaInicio : defaultFechaInicio;
    const endDate = isValidDate(fechaFin) ? fechaFin : defaultFechaFin;

    let where = 'WHERE em.fecha BETWEEN $1::TIMESTAMP AND $2::TIMESTAMP';
    const params = [startDate, endDate];
    let paramIndex = 3;

    if (tipoExamenId) {
      where += ` AND em.tipo_examen_id = $${paramIndex++}`;
      params.push(parseInt(tipoExamenId));
    }
    if (clinicaId) {
      where += ` AND em.clinica_id = $${paramIndex++}`;
      params.push(parseInt(clinicaId));
    }
    if (pacienteId) {
      where += ` AND em.paciente_id = $${paramIndex++}`;
      params.push(parseInt(pacienteId));
    }
    if (costoMin) {
      where += ` AND te.costo >= $${paramIndex++}`;
      params.push(parseFloat(costoMin));
    }
    if (costoMax) {
      where += ` AND te.costo <= $${paramIndex++}`;
      params.push(parseFloat(costoMax));
    }

    try {
      const data = await prisma.$queryRawUnsafe(`
        SELECT te.nombre AS tipo_examen, COUNT(em.id)::INTEGER AS conteo, SUM(te.costo) AS costo_total
        FROM public."Examenes_Medicos" em
        JOIN public."Tipos_Examenes" te ON em.tipo_examen_id = te.id
        ${where}
        GROUP BY te.nombre
        ORDER BY costo_total DESC
      `, ...params);

      // Transform data to ensure BigInt is converted to Number
      const serializedData = data.map(row => ({
        tipo_examen: row.tipo_examen,
        conteo: Number(row.conteo),
        costo_total: Number(row.costo_total)
      }));

      const chart = {
        type: 'bar',
        data: {
          labels: serializedData.map(row => row.tipo_examen),
          datasets: [{
            label: 'Costos por Tipo de Examen',
            data: serializedData.map(row => row.costo_total),
            backgroundColor: ['#4BC0C0', '#FF6384', '#36A2EB', '#FFCE56', '#9966FF'],
          }],
        },
        options: {
          responsive: true,
          scales: {
            y: { beginAtZero: true, title: { display: true, text: 'Costo Total ($)' } },
            x: { title: { display: true, text: 'Tipo de Examen' } },
          },
        },
      };

      if (req.query.format === 'csv') {
        const parser = new Parser();
        const csv = parser.parse(serializedData);
        res.header('Content-Type', 'text/csv');
        res.attachment('examenes_costos_por_tipo.csv');
        return res.send(csv);
      }

      res.json({ data: serializedData, chart });
    } catch (error) {
      console.error('Error en examenesCostosPorTipo:', error);
      res.status(500).json({ error: 'Error al generar el reporte', details: error.message });
    }
  }
}

module.exports = new ReportesController();
