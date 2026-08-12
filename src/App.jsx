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

const PageWrapper = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
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
      <Navbar />
      <main>
        <AnimatedRoutes />
      </main>
      <Footer />
      <SpotlightSearch />
      <TTSBar />
    </HashRouter>
  );
}

export default App;
