import { useState } from 'react';
import Sidebar from './Sidebar.jsx';
import Navbar from './Navbar.jsx';

function AppShell({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="relative flex w-full gap-6 lg:gap-8">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex min-h-screen w-full flex-1 flex-col gap-6">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 pb-8">{children}</main>
      </div>
    </div>
  );
}

export default AppShell;
