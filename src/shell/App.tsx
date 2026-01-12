import React, { useState, useEffect, lazy, Suspense, memo } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import LogoIcon from '@shell/components/LogoIcon';
import { AuthProvider } from '@shell/contexts/AuthContext';
import { ServicesProvider } from '@shell/contexts/ServicesContext';
import ProtectedRoute from '@shell/components/ProtectedRoute';
import { useSiteConfig } from '@shell/hooks/useSiteConfig';

// Lazy load pages for code-splitting with prefetch hints
const Home = lazy(() => import(/* webpackPrefetch: true */ '@shell/pages/Home'));
const Projects = lazy(() => import(/* webpackPrefetch: true */ '@shell/pages/Projects'));
const ProjectView = lazy(() => import('@shell/pages/ProjectView'));
const Research = lazy(() => import(/* webpackPrefetch: true */ '@shell/pages/Research'));
const ResearchView = lazy(() => import('@shell/pages/ResearchView'));
const About = lazy(() => import('@shell/pages/About'));
const Admin = lazy(() => import('@shell/pages/Admin'));
const Login = lazy(() => import('@shell/pages/Login'));
const PrivacyPolicy = lazy(() => import('@shell/pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('@shell/pages/TermsOfService'));

const Header: React.FC<{ darkMode: boolean; setDarkMode: (v: boolean) => void }> = memo(({ darkMode, setDarkMode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    }
  }, [darkMode]);

  const handleMobileNavClick = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <header role="banner" className="sticky top-0 z-50 flex items-center justify-between border-b border-[#e5e7eb] dark:border-white/10 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md px-6 py-4 lg:px-12 transition-colors">
      <Link to="/" className="flex items-center gap-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary" aria-label="Go to homepage">
        <LogoIcon />
        <h2 className="text-[#111318] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">sspirial.systems</h2>
        <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full border border-primary/20" aria-live="polite">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" aria-hidden="true"></span>
          <span className="text-xs font-mono font-medium text-primary uppercase tracking-wider">Systems Operational</span>
        </div>
      </Link>
      <div className="flex items-center gap-6">
        <nav className="hidden md:flex items-center gap-8" aria-label="Primary">
          <Link to="/projects" className={`text-sm font-medium transition-colors ${isActive('/projects') ? 'text-primary' : 'text-[#111318] dark:text-gray-300 hover:text-primary dark:hover:text-primary'}`}>Work</Link>
          <Link to="/about" className={`text-sm font-medium transition-colors ${isActive('/about') ? 'text-primary' : 'text-[#111318] dark:text-gray-300 hover:text-primary dark:hover:text-primary'}`}>About</Link>
          <Link to="/research" className={`text-sm font-medium transition-colors ${isActive('/research') ? 'text-primary' : 'text-[#111318] dark:text-gray-300 hover:text-primary dark:hover:text-primary'}`}>Lab / Knowledge</Link>
        </nav>
        <button type="button" onClick={toggleDarkMode} aria-label="Toggle dark mode" aria-pressed={darkMode} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
          <span className="material-symbols-outlined text-gray-600 dark:text-gray-300" aria-hidden="true">
            {darkMode ? 'light_mode' : 'dark_mode'}
          </span>
        </button>
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
          aria-label="Toggle navigation menu"
          aria-controls="primary-navigation"
          aria-expanded={mobileMenuOpen}
        >
          <span className="material-symbols-outlined text-[#111318] dark:text-white" aria-hidden="true">
            {mobileMenuOpen ? 'close' : 'menu'}
          </span>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white dark:bg-background-dark border-b border-[#e5e7eb] dark:border-white/10 shadow-lg z-40" aria-hidden={!mobileMenuOpen}>
          <nav id="primary-navigation" className="flex flex-col p-4 gap-4" aria-label="Mobile">
            <button 
              onClick={() => handleMobileNavClick('/projects')} 
              className={`text-left px-4 py-3 rounded-lg transition-colors ${isActive('/projects') ? 'bg-primary/10 text-primary font-medium' : 'text-[#111318] dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
            >
              Work
            </button>
            <button 
              onClick={() => handleMobileNavClick('/about')} 
              className={`text-left px-4 py-3 rounded-lg transition-colors ${isActive('/about') ? 'bg-primary/10 text-primary font-medium' : 'text-[#111318] dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
            >
              About
            </button>
            <button 
              onClick={() => handleMobileNavClick('/research')} 
              className={`text-left px-4 py-3 rounded-lg transition-colors ${isActive('/research') ? 'bg-primary/10 text-primary font-medium' : 'text-[#111318] dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
            >
              Lab / Knowledge
            </button>
          </nav>
        </div>
      )}
    </header>
  );
});

Header.displayName = 'Header';

const Footer: React.FC<{ siteConfig: any }> = memo(({ siteConfig }) => {
  return (
    <footer className="mt-auto border-t border-[#e5e7eb] dark:border-white/10 pt-16 pb-8 px-6 lg:px-12 bg-white dark:bg-background-dark">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16 max-w-[1200px] mx-auto w-full">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <LogoIcon />
            <span className="font-bold text-lg">sspirial.systems</span>
          </div>
          <p className="text-[#616f89] dark:text-gray-400 text-sm">
            {siteConfig.footer.bio}
          </p>
        </div>
        <div>
          <h2 className="font-bold mb-4 text-base">Sitemap</h2>
          <ul className="flex flex-col gap-2 text-sm text-[#616f89] dark:text-gray-400">
            {siteConfig.footer.sections.sitemap.map((link: any, idx: number) => (
              <li key={idx}><Link to={link.route} className="hover:text-primary transition-colors">{link.label}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="font-bold mb-4 text-base">Social</h2>
          <ul className="flex flex-col gap-2 text-sm text-[#616f89] dark:text-gray-400">
            {siteConfig.footer.sections.social.map((link: any, idx: number) => (
              <li key={idx}><a className="hover:text-primary transition-colors" href={link.url}>{link.label}</a></li>
            ))}
          </ul>
        </div>
      </div>
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-[#616f89] dark:text-gray-500 font-mono border-t border-[#e5e7eb] dark:border-[#2a3441] pt-8 max-w-[1200px] mx-auto w-full">
        <p>{siteConfig.footer.copyright}</p>
        <div className="flex gap-6">
          {siteConfig.footer.sections.legal.map((link: any, idx: number) => 
            link.url === '#' ? (
              <span key={idx}>{link.label}</span>
            ) : link.url.startsWith('/') ? (
              <Link key={idx} to={link.url} className="hover:text-primary transition-colors">{link.label}</Link>
            ) : (
              <a key={idx} href={link.url}>{link.label}</a>
            )
          )}
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = 'Footer';

// Optimized loading spinner component
const LoadingSpinner = memo(() => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <div className="flex flex-col items-center gap-4" role="status" aria-live="polite">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" aria-hidden="true"></div>
      <p className="text-sm text-gray-500 dark:text-gray-400">Loading...</p>
    </div>
  </div>
));

LoadingSpinner.displayName = 'LoadingSpinner';

const AppContent: React.FC = () => {
  const [darkMode, setDarkMode] = useState(true);
  const { config: siteConfig } = useSiteConfig();
  const location = useLocation();

  // Scroll to top on route change with RAF for better performance
  useEffect(() => {
    requestAnimationFrame(() => {
      window.scrollTo(0, 0);
    });
  }, [location.pathname]);

  return (
    <div className={`flex flex-col min-h-screen ${darkMode ? 'dark' : ''}`}>
      {/* Skip link for keyboard users */}
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />
      <main id="main-content" role="main" className="focus:outline-none">
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:id" element={<ProjectView />} />
            <Route path="/research" element={<Research />} />
            <Route path="/research/:id" element={<ResearchView />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/admin" element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            } />
          </Routes>
        </Suspense>
      </main>
      <Footer siteConfig={siteConfig} />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ServicesProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ServicesProvider>
    </BrowserRouter>
  );
};

export default App;
