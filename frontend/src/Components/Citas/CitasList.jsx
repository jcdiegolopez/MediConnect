import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../../services/apiService';

const CitasList = () => {
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    pacienteId: '',
    doctorId: '',
    estado: ''
  });

  useEffect(() => {
    loadCitas();
  }, [filters]);

  const loadCitas = async () => {
    try {
      setLoading(true);
      const data = await apiService.getCitas(filters);
      setCitas(data);
    } catch (error) {
      setError('Error al cargar citas: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de que desea eliminar esta cita?')) {
      try {
        await apiService.deleteCita(id);
        loadCitas();
      } catch (error) {
        setError('Error al eliminar cita: ' + error.message);
      }
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  if (loading) return <div className="loading">Cargando citas...</div>;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Gestión de Citas</h1>
        <Link to="/citas/nueva" className="btn btn-primary">
          Nueva Cita
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
          <div className="filter-group">
            <label className="form-label">Estado</label>
            <select
              name="estado"
              value={filters.estado}
              onChange={handleFilterChange}
              className="form-select"
            >
              <option value="">Todos</option>
              <option value="Programada">Programada</option>
              <option value="Completada">Completada</option>
              <option value="Cancelada">Cancelada</option>
            </select>
          </div>
        </div>

        {citas.length > 0 ? (
          <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Paciente</th>
              <th>Doctor</th>
              <th>Clínica</th>
              <th>Fecha</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {citas.map((cita) => (
              <tr key={cita.id}>
                <td>{cita.id}</td>
                <td>{cita.paciente}</td>
                <td>{cita.doctor}</td>
                <td>{cita.clinica}</td>
                <td>{new Date(cita.fecha).toLocaleString()}</td>
                <td>
                  <span className={`status-badge status-${cita.estado.toLowerCase()}`}>
                    {cita.estado}
                  </span>
                </td>
                <td>
                  {/* Acciones */}
                </td>
              </tr>
            ))}
          </tbody>
          </table>
        ) : (
          <p>No hay citas registradas</p>
        )}
      </div>
    </div>
  );
};

export default CitasList;