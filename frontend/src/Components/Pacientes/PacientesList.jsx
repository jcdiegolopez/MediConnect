import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../../services/apiService';

const PacientesList = () => {
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadPacientes();
  }, []);

  const loadPacientes = async () => {
    try {
      setLoading(true);
      const data = await apiService.getPacientes();
      setPacientes(data);
    } catch (error) {
      setError('Error al cargar pacientes: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de que desea eliminar este paciente?')) {
      try {
        await apiService.deletePaciente(id);
        loadPacientes();
      } catch (error) {
        setError('Error al eliminar paciente: ' + error.message);
      }
    }
  };

  if (loading) return <div className="loading">Cargando pacientes...</div>;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Gestión de Pacientes</h1>
        <Link to="/pacientes/nuevo" className="btn btn-primary">
          Nuevo Paciente
        </Link>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="card">
        {pacientes.length > 0 ? (
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Edad</th>
                <th>Género</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pacientes.map((paciente) => (
                <tr key={paciente.id}>
                  <td>{paciente.id}</td>
                  <td>{paciente.nombre}</td>
                  <td>{paciente.apellido}</td>
                  <td>{paciente.edad}</td>
                  <td>{paciente.genero}</td>
                  <td>{paciente.correo}</td>
                  <td>{paciente.telefono}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Link
                        to={`/pacientes/editar/${paciente.id}`}
                        className="btn btn-secondary"
                        style={{ fontSize: '12px', padding: '4px 8px' }}
                      >
                        Editar
                      </Link>
                      <button
                        onClick={() => handleDelete(paciente.id)}
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
          <p>No hay pacientes registrados</p>
        )}
      </div>
    </div>
  );
};

export default PacientesList;