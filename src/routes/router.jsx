import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from '../pages/Dashboard/Dashboard.jsx';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      {/* Other pages removed — single-page Dashboard application */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;
