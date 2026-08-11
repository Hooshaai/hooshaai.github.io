import { NavLink } from 'react-router-dom';
import { useState } from 'react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <i className="fas fa-brain brand-icon"></i>
        <span>Hoosha AI</span>
      </div>
      <div className={`nav-links ${isOpen ? 'active' : ''}`}>
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/research">Research</NavLink>
        <NavLink to="/ecosystem">Ecosystem</NavLink>
        <NavLink to="/models">Models</NavLink>
        <NavLink to="/labs">Labs</NavLink>
        <NavLink to="/platform">Platform</NavLink>
        <NavLink to="/admin" style={{ color: '#ef4444' }}>Admin</NavLink>
      </div>
      <div className="nav-actions">
        <button className="btn btn-secondary" onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))}>
          <i className="fas fa-search"></i> ⌘K
        </button>
        <button className="mobile-toggle" onClick={() => setIsOpen(!isOpen)}>
          <i className={`fas ${isOpen ? 'fa-times' : 'fa-bars'}`}></i>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
