import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ReportesList from '../components/Reportes/ReportesList';
import ReporteDetail from '../components/Reportes/ReporteDetail';

const ReportesPage = () => {
  return (
    <div style={{ paddingTop: '80px' }}>
      <Routes>
        <Route path="/" element={<ReportesList />} />
        <Route path="/:reportType" element={<ReporteDetail />} />
      </Routes>
    </div>
  );
};

export default ReportesPage;