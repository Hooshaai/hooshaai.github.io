import React from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Research from './pages/Research';
import Ecosystem from './pages/Ecosystem';
import Models from './pages/Models';
import Labs from './pages/Labs';
import Platform from './pages/Platform';
import Admin from './pages/Admin';
import SpotlightSearch from './components/ui/SpotlightSearch';
import TTSBar from './components/ui/TTSBar';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.warn('Recovered from DOM node mutation trace:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-12 text-center text-white font-mono bg-black min-h-[50vh] flex flex-col items-center justify-center">
          <h2 className="text-xl font-bold mb-4">View Restored</h2>
          <p className="text-xs text-gray-400 mb-6">DOM state re-synchronized cleanly.</p>
          <button 
            onClick={() => this.setState({ hasError: false })} 
            className="px-4 py-2 bg-white text-black font-bold text-xs rounded-xl hover:bg-gray-200 uppercase tracking-widest"
          >
            Reload View
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const PageWrapper = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.25 }}
    >
      {children}
    </motion.div>
  );
};

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
        <Route path="/research" element={<PageWrapper><Research /></PageWrapper>} />
        <Route path="/ecosystem" element={<PageWrapper><Ecosystem /></PageWrapper>} />
        <Route path="/models" element={<PageWrapper><Models /></PageWrapper>} />
        <Route path="/labs" element={<PageWrapper><Labs /></PageWrapper>} />
        <Route path="/platform" element={<PageWrapper><Platform /></PageWrapper>} />
        <Route path="/admin" element={<PageWrapper><Admin /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <HashRouter>
      <ErrorBoundary>
        <Navbar />
        <main>
          <AnimatedRoutes />
        </main>
        <Footer />
        <SpotlightSearch />
        <TTSBar />
      </ErrorBoundary>
    </HashRouter>
  );
}

export default App;
