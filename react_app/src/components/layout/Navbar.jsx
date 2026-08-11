import { NavLink } from 'react-router-dom';
import { useState } from 'react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="navbar fixed w-full top-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-800 flex justify-between items-center p-4">
      <div className="nav-brand flex items-center gap-2 text-xl font-bold">
        <i className="fas fa-brain text-cyan-400"></i>
        <span>Hoosha AI</span>
      </div>
      
      {/* Mobile Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/50 md:hidden" onClick={() => setIsOpen(false)}></div>}
      
      <div className={`nav-links fixed md:static top-0 right-0 h-screen md:h-auto w-64 md:w-auto bg-gray-900 md:bg-transparent border-l border-gray-800 md:border-none flex flex-col md:flex-row p-8 md:p-0 gap-6 transition-transform duration-300 ease-in-out transform ${isOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}`}>
        <button className="md:hidden absolute top-4 right-4 text-gray-400 hover:text-white" onClick={() => setIsOpen(false)}>
          <i className="fas fa-times text-xl"></i>
        </button>
        <NavLink to="/" end className="hover:text-cyan-400">Home</NavLink>
        <NavLink to="/research" className="hover:text-cyan-400">Research</NavLink>
        <NavLink to="/ecosystem" className="hover:text-cyan-400">Ecosystem</NavLink>
        <NavLink to="/models" className="hover:text-cyan-400">Models</NavLink>
        <NavLink to="/labs" className="hover:text-cyan-400">Labs</NavLink>
        <NavLink to="/platform" className="hover:text-cyan-400">Platform</NavLink>
        <NavLink to="/admin" className="text-red-500 hover:text-red-400">Admin</NavLink>
      </div>

      <div className="nav-actions flex items-center gap-4">
        <button className="relative text-gray-400 hover:text-white transition-colors">
          <i className="fas fa-bell"></i>
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-black"></span>
        </button>
        <button className="hidden md:flex items-center gap-2 bg-gray-800/50 hover:bg-gray-800 text-gray-300 px-3 py-1.5 rounded-lg border border-gray-700 text-sm transition-colors" onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))}>
          <i className="fas fa-search text-xs"></i> ⌘K
        </button>
        <button className="md:hidden text-gray-300" onClick={() => setIsOpen(true)}>
          <i className="fas fa-bars text-xl"></i>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
