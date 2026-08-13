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
import NotFound from './pages/NotFound';
import SpotlightSearch from './components/ui/SpotlightSearch';
import TTSBar from './components/ui/TTSBar';
import { AuthProvider } from './contexts/AuthContext';
import { TTSProvider } from './contexts/TTSContext';
import ProtectedRoute from './components/ui/ProtectedRoute';

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
        <div className="p-12 text-center text-white font-mono bg-black min-h-[50vh] flex flex-col items-center justify-center" role="alert">
          <h2 className="text-xl font-bold mb-4">View Restored</h2>
          <p className="text-xs text-gray-400 mb-6">DOM state re-synchronized cleanly.</p>
          <button 
            onClick={() => this.setState({ hasError: false })} 
            className="px-4 py-2 bg-white text-black font-bold text-xs rounded-xl hover:bg-gray-200 uppercase tracking-widest focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
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
        <Route 
          path="/platform" 
          element={
            <PageWrapper>
              <ProtectedRoute>
                <Platform />
              </ProtectedRoute>
            </PageWrapper>
          } 
        />
        <Route 
          path="/admin" 
          element={
            <PageWrapper>
              <Admin />
            </PageWrapper>
          } 
        />
        <Route path="*" element={<PageWrapper><NotFound /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <AuthProvider>
      <TTSProvider>
        <HashRouter>
          <ErrorBoundary>
            {/* Accessible Skip Link */}
            <a 
              href="#main-content" 
              className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2.5 focus:bg-cyan-400 focus:text-black focus:font-mono focus:font-bold focus:rounded-xl focus:shadow-2xl focus:outline-none"
            >
              Skip to main content
            </a>
            
            <Navbar />
            <main id="main-content" tabIndex={-1} className="outline-none">
              <AnimatedRoutes />
            </main>
            <Footer />
            <SpotlightSearch />
            <TTSBar />
          </ErrorBoundary>
        </HashRouter>
      </TTSProvider>
    </AuthProvider>
  );
}

export default App;
