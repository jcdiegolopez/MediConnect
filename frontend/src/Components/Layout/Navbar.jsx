import React from 'react';
import './Navbar.css';

const Navbar = ({ onToggleSidebar }) => {
  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-left">
          <button className="sidebar-toggle" onClick={onToggleSidebar}>
            ☰
          </button>
          <div className="navbar-brand">
            <h1>MediConnect Global</h1>
          </div>
        </div>
        <div className="navbar-right">
          <div className="user-info">
            <span>Administrador</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;