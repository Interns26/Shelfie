import Sidebar from './Sidebar.jsx';
import Navbar from './Navbar.jsx';

function AppShell({ children }) {
  return (
    <div className="relative flex w-full gap-6 lg:gap-8">
      <Sidebar />
      <div className="flex min-h-screen flex-1 flex-col gap-6">
        <Navbar />
        <main className="flex-1 pb-8">{children}</main>
      </div>
    </div>
  );
}

export default AppShell;
