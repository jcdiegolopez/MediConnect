import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../../services/apiService';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    pacientes: 0,
    citas: 0,
    consultas: 0,
    citasHoy: 0
  });
  const [recentCitas, setRecentCitas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [pacientes, citas, consultas] = await Promise.all([
        apiService.getPacientes(),
        apiService.getCitas(),
        apiService.getConsultas()
      ]);

      const today = new Date().toDateString();
      const citasHoy = citas.filter(cita => 
        new Date(cita.fecha).toDateString() === today
      ).length;

      setStats({
        pacientes: pacientes.length,
        citas: citas.length,
        consultas: consultas.length,
        citasHoy
      });

      setRecentCitas(citas.slice(0, 5));
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Cargando dashboard...</div>;
  }

  return (
    <div className="dashboard">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <div className="stat-number">{stats.pacientes}</div>
            <div className="stat-label">Pacientes Registrados</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <div className="stat-number">{stats.citas}</div>
            <div className="stat-label">Total Citas</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🩺</div>
          <div className="stat-content">
            <div className="stat-number">{stats.consultas}</div>
            <div className="stat-label">Consultas Realizadas</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <div className="stat-number">{stats.citasHoy}</div>
            <div className="stat-label">Citas Hoy</div>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="card">
          <h2>Citas Recientes</h2>
          {recentCitas.length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th>Paciente</th>
                  <th>Doctor</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                </tr>
              </thead>
                <tbody>
                  {recentCitas.map((cita) => (
                    <tr key={cita.id}>
                      <td>{cita.paciente}</td>
                      <td>{cita.doctor}</td>
                      <td>{new Date(cita.fecha).toLocaleString()}</td>
                      <td>
                        <span className={`status-badge status-${cita.estado.toLowerCase()}`}>
                          {cita.estado}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
            </table>
          ) : (
            <p>No hay citas registradas</p>
          )}
          <div style={{ marginTop: '16px' }}>
            <Link to="/citas" className="btn btn-primary">Ver todas las citas</Link>
          </div>
        </div>

        <div className="quick-actions">
          <h2>Acciones Rápidas</h2>
          <div className="action-buttons">
            <Link to="/pacientes/nuevo" className="action-btn">
              <span>👤</span>
              <span>Nuevo Paciente</span>
            </Link>
            <Link to="/citas/nueva" className="action-btn">
              <span>📅</span>
              <span>Nueva Cita</span>
            </Link>
            <Link to="/consultas/nueva" className="action-btn">
              <span>🩺</span>
              <span>Nueva Consulta</span>
            </Link>
            <Link to="/reportes" className="action-btn">
              <span>📊</span>
              <span>Ver Reportes</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;