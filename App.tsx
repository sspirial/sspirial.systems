
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { LogoIcon } from './constants';
import Home from './pages/Home';
import Projects from './pages/Projects';
import Research from './pages/Research';
import About from './pages/About';
import LabAssistant from './components/LabAssistant';

const Header: React.FC<{ darkMode: boolean; setDarkMode: (v: boolean) => void }> = ({ darkMode, setDarkMode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between border-b border-[#e5e7eb] dark:border-[#2a3441] bg-white/80 dark:bg-[#101622]/80 backdrop-blur-md px-6 py-4 lg:px-12 transition-colors">
      <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigate('/')}>
        <LogoIcon />
        <h2 className="text-[#111318] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">sspirial.systems</h2>
        <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900/30 rounded-full border border-green-200 dark:border-green-800">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          <span className="text-xs font-mono font-medium text-green-700 dark:text-green-400 uppercase tracking-wider">Systems Operational</span>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/projects" className={`text-sm font-medium transition-colors ${isActive('/projects') ? 'text-primary' : 'text-[#111318] dark:text-gray-300 hover:text-primary dark:hover:text-primary'}`}>Work</Link>
          <Link to="/about" className={`text-sm font-medium transition-colors ${isActive('/about') ? 'text-primary' : 'text-[#111318] dark:text-gray-300 hover:text-primary dark:hover:text-primary'}`}>About</Link>
          <Link to="/research" className={`text-sm font-medium transition-colors ${isActive('/research') ? 'text-primary' : 'text-[#111318] dark:text-gray-300 hover:text-primary dark:hover:text-primary'}`}>Lab / Knowledge</Link>
        </nav>
        <button onClick={toggleDarkMode} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <span className="material-symbols-outlined text-gray-600 dark:text-gray-300">
            {darkMode ? 'light_mode' : 'dark_mode'}
          </span>
        </button>
        <button className="hidden sm:flex min-w-[84px] cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all">
          Initialize Contact
        </button>
        <div className="md:hidden">
          <span className="material-symbols-outlined text-[#111318] dark:text-white">menu</span>
        </div>
      </div>
    </header>
  );
};

const Footer: React.FC = () => (
  <footer className="mt-auto border-t border-[#e5e7eb] dark:border-[#2a3441] pt-16 pb-8 px-6 lg:px-12 bg-white dark:bg-background-dark">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16 max-w-[1200px] mx-auto w-full">
      <div className="col-span-1 flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <LogoIcon />
          <span className="font-bold text-lg">sspirial.systems</span>
        </div>
        <p className="text-[#616f89] dark:text-gray-400 text-sm">
          Independent R&amp;D micro-studio.<br/>Building tomorrow's digital infrastructure.
        </p>
      </div>
      <div>
        <h4 className="font-bold mb-4">Sitemap</h4>
        <ul className="flex flex-col gap-2 text-sm text-[#616f89] dark:text-gray-400">
          <li><Link to="/projects" className="hover:text-primary transition-colors">Work Index</Link></li>
          <li><Link to="/about" className="hover:text-primary transition-colors">Studio Philosophy</Link></li>
          <li><Link to="/research" className="hover:text-primary transition-colors">Experimental Lab</Link></li>
          <li><Link to="/research" className="hover:text-primary transition-colors">Journal</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="font-bold mb-4">Social</h4>
        <ul className="flex flex-col gap-2 text-sm text-[#616f89] dark:text-gray-400">
          <li><a className="hover:text-primary transition-colors" href="#">GitHub</a></li>
          <li><a className="hover:text-primary transition-colors" href="#">Twitter / X</a></li>
          <li><a className="hover:text-primary transition-colors" href="#">LinkedIn</a></li>
        </ul>
      </div>
      <div className="flex flex-col gap-4">
        <h4 className="font-bold">Newsletter</h4>
        <p className="text-sm text-[#616f89] dark:text-gray-400">Updates on new experiments and releases.</p>
        <div className="flex gap-2">
          <input className="bg-white dark:bg-[#151c2a] border border-[#e5e7eb] dark:border-[#2a3441] text-sm rounded px-3 py-2 w-full focus:outline-none focus:border-primary text-slate-900 dark:text-white" placeholder="email@address.com" type="email"/>
          <button className="bg-primary text-white p-2 rounded hover:bg-primary/90">
            <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
    <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-[#616f89] dark:text-gray-500 font-mono border-t border-[#e5e7eb] dark:border-[#2a3441] pt-8 max-w-[1200px] mx-auto w-full">
      <p>© 2024 sspirial.systems. All rights reserved.</p>
      <div className="flex gap-6">
        <a href="#">Privacy Policy</a>
        <a href="#">Terms of Service</a>
        <a href="#">System Status: Operational</a>
      </div>
    </div>
  </footer>
);

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <HashRouter>
      <div className={`flex flex-col min-h-screen ${darkMode ? 'dark' : ''}`}>
        <Header darkMode={darkMode} setDarkMode={setDarkMode} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/research" element={<Research />} />
          <Route path="/about" element={<About />} />
        </Routes>
        <Footer />
        <LabAssistant />
      </div>
    </HashRouter>
  );
};

export default App;
