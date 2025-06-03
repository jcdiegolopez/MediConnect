import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Layout/Navbar';
import Sidebar from './components/Layout/Sidebar';
import Dashboard from './components/Dashboard/Dashboard';
import PacientesPage from './pages/PacientesPage';
import CitasPage from './pages/CitasPage';
import ConsultasPage from './pages/ConsultasPage';
import ReportesPage from './pages/ReportesPage';
import './App.css';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <Router>
      <div className="app">
        <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <div className="app-content">
          <Sidebar isOpen={sidebarOpen} />
          <main className={`main-content ${sidebarOpen ? 'with-sidebar' : 'full-width'}`}>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/pacientes/*" element={<PacientesPage />} />
              <Route path="/citas/*" element={<CitasPage />} />
              <Route path="/consultas/*" element={<ConsultasPage />} />
              <Route path="/reportes/*" element={<ReportesPage />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;