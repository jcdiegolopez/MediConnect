import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PacientesList from '../components/Pacientes/PacientesList';
import PacienteForm from '../components/Pacientes/PacienteForm';

const PacientesPage = () => {
  return (
    <div style={{ paddingTop: '80px' }}>
      <Routes>
        <Route path="/" element={<PacientesList />} />
        <Route path="/nuevo" element={<PacienteForm />} />
        <Route path="/editar/:id" element={<PacienteForm />} />
      </Routes>
    </div>
  );
};

export default PacientesPage;