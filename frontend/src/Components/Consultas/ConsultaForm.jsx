import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiService } from '../../services/apiService';

const ConsultaForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    paciente_id: '',
    doctor_id: '',
    clinica_id: '',
    fecha: '',
    diagnostico: '',
    notas: {
      observaciones: '',
      sintomas: '',
      recomendaciones: ''
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (isEditing) {
      loadConsulta();
    }
  }, [id]);

  const loadConsulta = async () => {
    try {
      setLoading(true);
      const consulta = await apiService.getConsultaById(id);
      setFormData({
        paciente_id: consulta.paciente_id,
        doctor_id: consulta.doctor_id,
        clinica_id: consulta.clinica_id,
        fecha: new Date(consulta.fecha).toISOString().slice(0, 16),
        diagnostico: consulta.diagnostico,
        notas: consulta.notas || {
          observaciones: '',
          sintomas: '',
          recomendaciones: ''
        }
      });
    } catch (error) {
      setError('Error al cargar consulta: ' + error.message);
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

  const handleNotasChange = (e) => {
    setFormData({
      ...formData,
      notas: {
        ...formData.notas,
        [e.target.name]: e.target.value
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

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
        await apiService.updateConsulta(id, dataToSend);
        setSuccess('Consulta actualizada exitosamente');
      } else {
        await apiService.createConsulta(dataToSend);
        setSuccess('Consulta creada exitosamente');
      }
      
      setTimeout(() => {
        navigate('/consultas');
      }, 2000);
    } catch (error) {
      setError('Error al guardar consulta: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">
          {isEditing ? 'Editar Consulta' : 'Nueva Consulta'}
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
              <label className="form-label">Fecha y Hora *</label>
              <input
                type="datetime-local"
                name="fecha"
                value={formData.fecha}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Diagnóstico *</label>
              <textarea
                name="diagnostico"
                value={formData.diagnostico}
                onChange={handleChange}
                className="form-input"
                required
                rows="3"
                style={{ resize: 'vertical' }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Observaciones *</label>
              <textarea
                name="observaciones"
                value={formData.notas.observaciones}
                onChange={handleNotasChange}
                className="form-input"
                required
                rows="4"
                style={{ resize: 'vertical' }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Síntomas *</label>
              <textarea
                name="sintomas"
                value={formData.notas.sintomas}
                onChange={handleNotasChange}
                className="form-input"
                required
                rows="4"
                style={{ resize: 'vertical' }}
                placeholder="Describe los síntomas del paciente"
              />
            </div>

            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Recomendaciones *</label>
              <textarea
                name="recomendaciones"
                value={formData.notas.recomendaciones}
                onChange={handleNotasChange}
                className="form-input"
                required
                rows="3"
                style={{ resize: 'vertical' }}
                placeholder="Recomendaciones de tratamiento"
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
              onClick={() => navigate('/consultas')}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConsultaForm;