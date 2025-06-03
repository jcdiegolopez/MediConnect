import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ConsultasList from '../components/Consultas/ConsultasList';
import ConsultaForm from '../components/Consultas/ConsultaForm';

const ConsultasPage = () => {
  return (
    <div style={{ paddingTop: '80px' }}>
      <Routes>
        <Route path="/" element={<ConsultasList />} />
        <Route path="/nueva" element={<ConsultaForm />} />
        <Route path="/editar/:id" element={<ConsultaForm />} />
      </Routes>
    </div>
  );
};

export default ConsultasPage;