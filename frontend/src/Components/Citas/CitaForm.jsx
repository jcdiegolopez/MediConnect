import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiService } from '../../services/apiService';

const CitaForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    paciente_id: '',
    doctor_id: '',
    clinica_id: '',
    fecha: '',
    estado: 'Programada'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (isEditing) {
      loadCita();
    }
  }, [id]);

  const loadCita = async () => {
    try {
      setLoading(true);
      const cita = await apiService.getCitaById(id);
      setFormData({
        paciente_id: cita.paciente_id,
        doctor_id: cita.doctor_id,
        clinica_id: cita.clinica_id,
        fecha: new Date(cita.fecha).toISOString().slice(0, 16),
        estado: cita.estado
      });
    } catch (error) {
      setError('Error al cargar cita: ' + error.message);
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

    // Validar que la fecha sea futura
    const fechaCita = new Date(formData.fecha);
    const ahora = new Date();
    if (fechaCita <= ahora) {
      setError('La fecha de la cita debe ser futura');
      return;
    }

    // Validar horario de trabajo (8 AM - 6 PM)
    const hora = fechaCita.getHours();
    if (hora < 8 || hora > 18) {
      setError('Las citas deben ser entre las 8:00 AM y 6:00 PM');
      return;
    }

    try {
      setLoading(true);
      const dataToSend = {
        ...formData,
        paciente_id: parseInt(formData.paciente_id),
        doctor_id: parseInt(formData.doctor_id),
        clinica_id: parseInt(formData.clinica_id),
        fecha: new Date(formData.fecha).toISOString()
      };

      if (isEditing) {
        await apiService.updateCita(id, dataToSend);
        setSuccess('Cita actualizada exitosamente');
      } else {
        await apiService.createCita(dataToSend);
        setSuccess('Cita creada exitosamente');
      }
      
      setTimeout(() => {
        navigate('/citas');
      }, 2000);
    } catch (error) {
      setError('Error al guardar cita: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">
          {isEditing ? 'Editar Cita' : 'Nueva Cita'}
        </h1>
      </div>

      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">ID del Paciente *</label>
              <input
                type="number"
                name="paciente_id"
                value={formData.paciente_id}
                onChange={handleChange}
                className="form-input"
                required
                min="1"
              />
            </div>

            <div className="form-group">
              <label className="form-label">ID del Doctor *</label>
              <input
                type="number"
                name="doctor_id"
                value={formData.doctor_id}
                onChange={handleChange}
                className="form-input"
                required
                min="1"
              />
            </div>

            <div className="form-group">
              <label className="form-label">ID de la Clínica *</label>
              <input
                type="number"
                name="clinica_id"
                value={formData.clinica_id}
                onChange={handleChange}
                className="form-input"
                required
                min="1"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Estado</label>
              <select
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                className="form-select"
              >
                <option value="Programada">Programada</option>
                <option value="Completada">Completada</option>
                <option value="Cancelada">Cancelada</option>
              </select>
            </div>

            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Fecha y Hora *</label>
              <input
                type="datetime-local"
                name="fecha"
                value={formData.fecha}
                onChange={handleChange}
                className="form-input"
                required
              />
              <small style={{ color: '#6b7280', fontSize: '12px' }}>
                Las citas deben ser programadas entre las 8:00 AM y 6:00 PM
              </small>
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
              onClick={() => navigate('/citas')}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CitaForm;