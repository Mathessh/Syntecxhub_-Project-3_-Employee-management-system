import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import {
  HiOutlineViewGrid,
  HiOutlineUsers,
  HiOutlineUserAdd,
  HiOutlineMenu,
  HiOutlineX,
} from 'react-icons/hi';
import Dashboard from './pages/Dashboard';
import EmployeeList from './pages/EmployeeList';
import './index.css';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <Router>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1a1f35',
            color: '#f1f5f9',
            border: '1px solid rgba(148, 163, 184, 0.1)',
            borderRadius: '12px',
            fontSize: '14px',
            fontFamily: 'Inter, sans-serif',
          },
          success: {
            iconTheme: { primary: '#10b981', secondary: '#fff' },
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: '#fff' },
          },
        }}
      />

      <div className="app-layout">
        {/* Mobile overlay */}
        <div
          className={`sidebar-overlay ${sidebarOpen ? 'show' : ''}`}
          onClick={closeSidebar}
        />

        {/* Sidebar */}
        <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
          <div className="sidebar-header">
            <div className="sidebar-logo">
              <div className="sidebar-logo-icon">👥</div>
              <div>
                <div className="sidebar-logo-text">StaffHub</div>
                <div className="sidebar-logo-sub">Employee Management</div>
              </div>
            </div>
          </div>
          <nav className="sidebar-nav">
            <NavLink
              to="/"
              end
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={closeSidebar}
            >
              <span className="nav-link-icon"><HiOutlineViewGrid /></span>
              Dashboard
            </NavLink>
            <NavLink
              to="/employees"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={closeSidebar}
            >
              <span className="nav-link-icon"><HiOutlineUsers /></span>
              Employees
            </NavLink>
          </nav>
        </aside>

        {/* Main content */}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/employees" element={<EmployeeList />} />
          </Routes>
        </main>

        {/* Mobile toggle */}
        <button className="mobile-toggle" onClick={toggleSidebar}>
          {sidebarOpen ? <HiOutlineX /> : <HiOutlineMenu />}
        </button>
      </div>
    </Router>
  );
}

export default App;
