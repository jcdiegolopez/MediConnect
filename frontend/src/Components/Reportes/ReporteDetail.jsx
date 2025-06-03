import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiService } from '../../services/apiService';

const ReporteDetail = () => {
  const { reportType } = useParams();
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Usar funciones flecha para mantener el contexto de apiService
  const reportConfigs = {
    'patients-by-age-group': {
      title: 'Pacientes por Grupo de Edad',
      api: (filters) => apiService.getReportePatientsByAgeGroup(filters),
      filters: [
        { name: 'genero', label: 'Género', type: 'select', options: [
          { value: '', label: 'Todos' },
          { value: 'M', label: 'Masculino' },
          { value: 'F', label: 'Femenino' }
        ]},
        { name: 'clinicaId', label: 'ID Clínica', type: 'number' },
        { name: 'alergia', label: 'Alergia', type: 'text' },
        { name: 'minConsultas', label: 'Mín. Consultas', type: 'number' },
        { name: 'fechaRegistroInicio', label: 'Fecha Inicio', type: 'date' },
        { name: 'fechaRegistroFin', label: 'Fecha Fin', type: 'date' }
      ],
      columns: [
        { key: 'age_group', label: 'Grupo de Edad' },
        { key: 'patient_count', label: 'Cantidad de Pacientes' }
      ]
    },
    'doctor-consultation-counts': {
      title: 'Consultas por Doctor',
      api: (filters) => apiService.getReporteDoctorConsultationCounts(filters),
      filters: [
        { name: 'especialidadId', label: 'ID Especialidad', type: 'number' },
        { name: 'clinicaId', label: 'ID Clínica', type: 'number' },
        { name: 'fechaInicio', label: 'Fecha Inicio', type: 'date' },
        { name: 'fechaFin', label: 'Fecha Fin', type: 'date' },
        { name: 'diagnostico', label: 'Diagnóstico', type: 'text' },
        { name: 'minConsultas', label: 'Mín. Consultas', type: 'number' }
      ],
      columns: [
        { key: 'doctor', label: 'Doctor' },
        { key: 'consultations', label: 'Consultas' }
      ]
    },
    'clinic-activity': {
      title: 'Actividad de Clínicas',
      api: (filters) => apiService.getReporteClinicActivity(filters),
      filters: [
        { name: 'clinicaId', label: 'ID Clínica', type: 'number' },
        { name: 'fechaInicio', label: 'Fecha Inicio', type: 'date' },
        { name: 'fechaFin', label: 'Fecha Fin', type: 'date' },
        { name: 'especialidadId', label: 'ID Especialidad', type: 'number' },
        { name: 'genero', label: 'Género', type: 'select', options: [
          { value: '', label: 'Todos' },
          { value: 'Masculino', label: 'Masculino' },
          { value: 'Femenino', label: 'Femenino' }
        ]},
        { name: 'diagnostico', label: 'Diagnóstico', type: 'text' }
      ],
      columns: [
        { key: 'clinica', label: 'Clínica' },
        { key: 'total_consultations', label: 'Total Consultas' },
        { key: 'avg_patient_age', label: 'Edad Promedio Pacientes' }
      ]
    }
  };

  const config = reportConfigs[reportType];

  useEffect(() => {
    if (config) {
      loadReport();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reportType, filters]);

  const loadReport = async () => {
    try {
      setLoading(true);
      setError('');
      const result = await config.api(filters);
      setData(result.data || result);
    } catch (error) {
      setError('Error al cargar reporte: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const exportToCsv = async () => {
    try {
      const result = await config.api({ ...filters, format: 'csv' });
      // Si el backend devuelve un string CSV, úsalo directamente
      const blob = new Blob([result], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${reportType}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      setError('Error al exportar CSV: ' + error.message);
    }
  };

  if (!config) {
    return (
      <div>
        <div className="page-header">
          <h1 className="page-title">Reporte no encontrado</h1>
          <Link to="/reportes" className="btn btn-secondary">Volver a Reportes</Link>
        </div>
        <div className="error">El tipo de reporte "{reportType}" no existe.</div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">{config.title}</h1>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={exportToCsv} className="btn btn-success">
            Exportar CSV
          </button>
          <Link to="/reportes" className="btn btn-secondary">
            Volver a Reportes
          </Link>
        </div>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="card">
        <h3>Filtros</h3>
        <div className="filters">
          {config.filters.map((filter) => (
            <div key={filter.name} className="filter-group">
              <label className="form-label">{filter.label}</label>
              {filter.type === 'select' ? (
                <select
                  name={filter.name}
                  value={filters[filter.name] || ''}
                  onChange={handleFilterChange}
                  className="form-select"
                >
                  {filter.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={filter.type}
                  name={filter.name}
                  value={filters[filter.name] || ''}
                  onChange={handleFilterChange}
                  className="form-input"
                  placeholder={filter.label}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h3>Resultados</h3>
        {loading ? (
          <div className="loading">Cargando datos...</div>
        ) : data.length > 0 ? (
          <table className="table">
            <thead>
              <tr>
                {config.columns.map((column) => (
                  <th key={column.key}>{column.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr key={index}>
                  {config.columns.map((column) => (
                    <td key={column.key}>{row[column.key]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No hay datos disponibles con los filtros aplicados</p>
        )}
      </div>
    </div>
  );
};

export default ReporteDetail;