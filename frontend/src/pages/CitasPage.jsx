import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CitasList from '../components/Citas/CitasList';
import CitaForm from '../components/Citas/CitaForm';

const CitasPage = () => {
  return (
    <div style={{ paddingTop: '80px' }}>
      <Routes>
        <Route path="/" element={<CitasList />} />
        <Route path="/nueva" element={<CitaForm />} />
        <Route path="/editar/:id" element={<CitaForm />} />
      </Routes>
    </div>
  );
};

export default CitasPage;