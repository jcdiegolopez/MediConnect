const ReportesService = require('../services/reportesService');
const { Parser } = require('json2csv');

class ReportesController {
  async patientsByAgeGroup(req, res) {
    try {
      const { genero, clinicaId, alergia, minConsultas, fechaRegistroInicio, fechaRegistroFin, format } = req.query;
      const data = await ReportesService.getPatientsByAgeGroup({
        genero,
        clinicaId,
        alergia,
        minConsultas,
        fechaRegistroInicio,
        fechaRegistroFin
      });

      const chart = {
        type: 'bar',
        data: {
          labels: data.map(row => row.age_group),
          datasets: [{
            label: 'Patients by Age Group',
            data: data.map(row => row.patient_count),
            backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56', '#4BC0C0']
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: { beginAtZero: true, title: { display: true, text: 'Number of Patients' } },
            x: { title: { display: true, text: 'Age Group' } }
          }
        }
      };

      if (format === 'csv') {
        if (!data || data.length === 0) {
          return res.status(400).json({ error: 'No hay datos para exportar a CSV.' });
        }

        try {
          const parser = new Parser();
          const csv = parser.parse(data);
          res.header('Content-Type', 'text/csv');
          res.attachment('patients_by_age_group.csv');
          return res.send(csv);
        } catch (csvError) {
          return res.status(500).json({ error: `Error generando CSV: ${csvError.message}` });
        }
      }
      

      res.json({ data, chart });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async doctorConsultationCounts(req, res) {
    try {
      const { especialidadId, clinicaId, fechaInicio, fechaFin, diagnostico, minConsultas, format } = req.query;
      const data = await ReportesService.getDoctorConsultationCounts({
        especialidadId,
        clinicaId,
        fechaInicio,
        fechaFin,
        diagnostico,
        minConsultas
      });

      const chart = {
        type: 'bar',
        data: {
          labels: data.map(row => row.doctor),
          datasets: [{
            label: 'Consultations by Doctor',
            data: data.map(row => row.consultations),
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: { beginAtZero: true, title: { display: true, text: 'Number of Consultations' } },
            x: { title: { display: true, text: 'Doctor' } }
          }
        }
      };


      if (format === 'csv') {
        if (!data || data.length === 0) {
          return res.status(400).json({ error: 'No hay datos para exportar a CSV.' });
        }

        try {
          const parser = new Parser();
          const csv = parser.parse(data);
          res.header('Content-Type', 'text/csv');
          res.attachment('doctor_consultation_counts.csv');
          return res.send(csv);
        } catch (csvError) {
          return res.status(500).json({ error: `Error generando CSV: ${csvError.message}` });
        }
      }

      res.json({ data, chart });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async clinicActivity(req, res) {
    try {
      const { clinicaId, fechaInicio, fechaFin, especialidadId, genero, diagnostico, format } = req.query;
      const data = await ReportesService.getClinicActivity({
        clinicaId,
        fechaInicio,
        fechaFin,
        especialidadId,
        genero,
        diagnostico
      });

      const chart = {
        type: 'bar',
        data: {
          labels: data.map(row => row.clinica),
          datasets: [
            {
              label: 'Total Consultations',
              data: data.map(row => row.total_consultations),
              backgroundColor: '#36A2EB'
            },
            {
              label: 'Average Patient Age',
              data: data.map(row => row.avg_patient_age),
              backgroundColor: '#FF6384',
              yAxisID: 'y2'
            }
          ]
        },
        options: {
          responsive: true,
          scales: {
            y: { beginAtZero: true, title: { display: true, text: 'Consultations' } },
            y2: { beginAtZero: true, position: 'right', title: { display: true, text: 'Average Age' } },
            x: { title: { display: true, text: 'Clinic' } }
          }
        }
      };

      if (format === 'csv') {
        if (!data || data.length === 0) {
          return res.status(400).json({ error: 'No hay datos para exportar a CSV.' });
        }

        try {
          const parser = new Parser();
          const csv = parser.parse(data);
          res.header('Content-Type', 'text/csv');
          res.attachment('clinic_activity.csv');
          return res.send(csv);
        } catch (csvError) {
          return res.status(500).json({ error: `Error generando CSV: ${csvError.message}` });
        }
      }
      
      res.json({ data, chart });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new ReportesController();
