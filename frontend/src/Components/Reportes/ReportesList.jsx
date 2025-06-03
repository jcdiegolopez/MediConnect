import React from 'react';
import { Link } from 'react-router-dom';

const ReportesList = () => {
  const reportes = [
    {
      id: 'patients-by-age-group',
      title: 'Pacientes por Grupo de Edad',
      description: 'Análisis de la distribución de pacientes por rangos de edad',
      icon: '👥'
    },
    {
      id: 'doctor-consultation-counts',
      title: 'Consultas por Doctor',
      description: 'Cantidad de consultas realizadas por cada doctor',
      icon: '👨‍⚕️'
    },
    {
      id: 'clinic-activity',
      title: 'Actividad de Clínicas',
      description: 'Resumen de actividades y estadísticas por clínica',
      icon: '🏥'
    }
  ];

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Reportes y Estadísticas</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        {reportes.map((reporte) => (
          <div key={reporte.id} className="card" style={{ cursor: 'pointer', transition: 'transform 0.2s' }}>
            <Link 
              to={`/reportes/${reporte.id}`} 
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                <div style={{ fontSize: '48px', marginBottom: '8px' }}>{reporte.icon}</div>
                <h3 style={{ margin: '0 0 8px 0', color: '#1f2937' }}>{reporte.title}</h3>
                <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>{reporte.description}</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <span className="btn btn-primary">Ver Reporte</span>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReportesList;