import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiService } from '../../services/apiService';

const PacienteForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    fecha_nacimiento: '',
    genero: '',
    correo: '',
    telefono: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (isEditing) {
      loadPaciente();
    }
  }, [id]);

  const loadPaciente = async () => {
    try {
      setLoading(true);
      const paciente = await apiService.getPacienteById(id);
      setFormData({
        nombre: paciente.nombre,
        apellido: paciente.apellido,
        fecha_nacimiento: paciente.fecha_nacimiento.split('T')[0],
        genero: paciente.genero,
        correo: paciente.correo,
        telefono: paciente.telefono
      });
    } catch (error) {
      setError('Error al cargar paciente: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      setLoading(true);

      // Convertir fecha_nacimiento a ISO-8601 si existe
      const dataToSend = {
        ...formData,
        fecha_nacimiento: formData.fecha_nacimiento
          ? new Date(formData.fecha_nacimiento).toISOString()
          : undefined,
      };

      if (isEditing) {
        await apiService.updatePaciente(id, dataToSend);
        setSuccess('Paciente actualizado exitosamente');
      } else {
        await apiService.createPaciente(dataToSend);
        setSuccess('Paciente creado exitosamente');
      }

      setTimeout(() => {
        navigate('/pacientes');
      }, 2000);
    } catch (error) {
      setError('Error al guardar paciente: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">
          {isEditing ? 'Editar Paciente' : 'Nuevo Paciente'}
        </h1>
      </div>

      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Nombre *</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Apellido *</label>
              <input
                type="text"
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Fecha de Nacimiento *</label>
              <input
                type="date"
                name="fecha_nacimiento"
                value={formData.fecha_nacimiento}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Género</label>
              <select
                name="genero"
                value={formData.genero}
                onChange={handleChange}
                className="form-select"
              >
                <option value="">Seleccionar...</option>
                <option value="M">Masculino</option>
                <option value="F">Femenino</option>
                <option value="Otro">Otro</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Email *</label>
              <input
                type="email"
                name="correo"
                value={formData.correo}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Teléfono</label>
              <input
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                className="form-input"
              />
            </div>
          </div>

          <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Crear')}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/pacientes')}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PacienteForm;