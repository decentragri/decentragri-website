import { useCallback } from 'preact/hooks';
import { useLocation } from 'wouter';
import { useThemeStore } from '../../context/ThemeContext';
import './NotFound.css';

const NotFound = () => {
  const [_, setLocation] = useLocation();
  const { isDarkMode } = useThemeStore();

  const handleGoHome = useCallback((e: Event) => {
    e.preventDefault();
    setLocation('/');
    // Force a page reload to ensure proper rendering
    window.location.reload();
  }, [setLocation]);

  const handleGoBack = useCallback(() => {
    window.history.back();
  }, []);

  return (
    <div className={`not-found-container ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="not-found-content">
        <div className="logo-container">
          <img 
            src="/assets/img/logo/decentra_logo2.png" 
            alt="Decentragri Logo" 
            className="not-found-logo"
          />
        </div>
        
        <div className="error-code">
          <span>4</span>
          <div className="zero-container">
            <img 
              src="/assets/img/logo/decentra_logo2.png" 
              alt="0" 
              className="rotating-logo"
            />
          </div>
          <span>4</span>
        </div>

        <h1>Page Not Found</h1>
        <p className="error-message">
          Oops! Looks like you've wandered into uncharted territory. 
          This page is as rare as a digital crop failure!
        </p>

        <div className="action-buttons">
          <button 
            onClick={handleGoBack}
            className="back-button"
          >
            <i className="fas fa-arrow-left"></i>
            Go Back
          </button>
          <button 
            onClick={handleGoHome}
            className="home-button"
          >
            <i className="fas fa-home"></i>
            Return Home
          </button>
        </div>

        <div className="decorative-elements">
          <i className="fas fa-seedling seedling-1"></i>
          <i className="fas fa-leaf leaf-1"></i>
          <i className="fas fa-wheat wheat-1"></i>
          <i className="fas fa-seedling seedling-2"></i>
          <i className="fas fa-leaf leaf-2"></i>
          <i className="fas fa-wheat wheat-2"></i>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
