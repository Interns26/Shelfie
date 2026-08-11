/* Copyright (c) UWorx Services 2026. All Rights Reserved. The information contained herein is proprietary and confidential. This proprietary and confidential information, either in whole or in part, shall not be used for any purpose unless permitted by the terms of a valid license agreement. */
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
