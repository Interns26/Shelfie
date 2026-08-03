import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from '../pages/Dashboard/Dashboard.jsx';
import ShelfMonitoring from '../pages/ShelfMonitoring/ShelfMonitoring.jsx';
import DetectionResults from '../pages/DetectionResults/DetectionResults.jsx';
import ImageUpload from '../pages/ImageUpload/ImageUpload.jsx';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/monitoring" element={<ShelfMonitoring />} />
      <Route path="/results" element={<DetectionResults />} />
      <Route path="/upload" element={<ImageUpload />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;
