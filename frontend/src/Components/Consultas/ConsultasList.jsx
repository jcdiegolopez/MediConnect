import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../../services/apiService';

const ConsultasList = () => {
  const [consultas, setConsultas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    pacienteId: '',
    doctorId: ''
  });

  useEffect(() => {
    loadConsultas();
  }, [filters]);

  const loadConsultas = async () => {
    try {
      setLoading(true);
      const data = await apiService.getConsultas(filters);
      setConsultas(data);
    } catch (error) {
      setError('Error al cargar consultas: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de que desea eliminar esta consulta?')) {
      try {
        await apiService.deleteConsulta(id);
        loadConsultas();
      } catch (error) {
        setError('Error al eliminar consulta: ' + error.message);
      }
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  if (loading) return <div className="loading">Cargando consultas...</div>;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Gestión de Consultas</h1>
        <Link to="/consultas/nueva" className="btn btn-primary">
          Nueva Consulta
        </Link>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="card">
        <div className="filters">
          <div className="filter-group">
            <label className="form-label">Paciente ID</label>
            <input
              type="number"
              name="pacienteId"
              value={filters.pacienteId}
              onChange={handleFilterChange}
              className="form-input"
              placeholder="ID del paciente"
            />
          </div>
          <div className="filter-group">
            <label className="form-label">Doctor ID</label>
            <input
              type="number"
              name="doctorId"
              value={filters.doctorId}
              onChange={handleFilterChange}
              className="form-input"
              placeholder="ID del doctor"
            />
          </div>
        </div>

        {consultas.length > 0 ? (
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Paciente</th>
                <th>Doctor</th>
                <th>Clínica</th>
                <th>Fecha</th>
                <th>Diagnóstico</th>
                <th>Recetas</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {consultas.map((consulta) => (
                <tr key={consulta.id}>
                  <td>{consulta.id}</td>
                  <td>{consulta.paciente}</td>
                  <td>{consulta.doctor}</td>
                  <td>{consulta.clinica}</td>
                  <td>{new Date(consulta.fecha).toLocaleString()}</td>
                  <td>{consulta.diagnostico}</td>
                  <td>{consulta.recetas}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Link
                        to={`/consultas/editar/${consulta.id}`}
                        className="btn btn-secondary"
                        style={{ fontSize: '12px', padding: '4px 8px' }}
                      >
                        Editar
                      </Link>
                      <button
                        onClick={() => handleDelete(consulta.id)}
                        className="btn btn-danger"
                        style={{ fontSize: '12px', padding: '4px 8px' }}
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No hay consultas registradas</p>
        )}
      </div>
    </div>
  );
};

export default ConsultasList;