import { useEffect, useCallback } from 'react';
import { Link } from 'wouter';
import { useThemeStore } from '../../context/ThemeContext';
import "./Header.css";


const Header = () => {
  const { isDarkMode, toggleTheme } = useThemeStore();

  // Handler to open mobile menu
  const openMobileMenu = useCallback(() => {
    document.body.classList.add('mobile-menu-visible');
  }, []);

  // Handler to close mobile menu
  const closeMobileMenu = useCallback(() => {
    document.body.classList.remove('mobile-menu-visible');
  }, []);

  useEffect(() => {
    // Sticky header on scroll
    const handleScroll = () => {
      const scroll = window.scrollY;
      const stickyHeader = document.getElementById('sticky-header');
      const headerTopFixed = document.getElementById('header-top-fixed');
      const scrollToTarget = document.querySelector('.scroll-to-target');
      if (scroll < 245) {
        stickyHeader && stickyHeader.classList.remove('sticky-menu');
        scrollToTarget && scrollToTarget.classList.remove('open');
        headerTopFixed && headerTopFixed.classList.remove('header-fixed-position');
      } else {
        stickyHeader && stickyHeader.classList.add('sticky-menu');
        scrollToTarget && scrollToTarget.classList.add('open');
        headerTopFixed && headerTopFixed.classList.add('header-fixed-position');
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Scroll to target
    const scrollToTargetBtn = document.querySelector('.scroll-to-target');
    interface ScrollToTargetEvent extends React.MouseEvent<HTMLElement> {
      currentTarget: HTMLElement & { getAttribute(attr: string): string | null };
    }

    const handleScrollToTarget = (e: Event | ScrollToTargetEvent) => {
      const target = (e.currentTarget as HTMLElement).getAttribute('data-target');
      const el = target ? document.querySelector(target) as HTMLElement | null : null;
      if (el) {
      window.scrollTo({ top: el.offsetTop, behavior: 'smooth' });
      }
    };
    if (scrollToTargetBtn) {
      scrollToTargetBtn.addEventListener('click', handleScrollToTarget);
    }

    // Clean up
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollToTargetBtn) {
        scrollToTargetBtn.removeEventListener('click', handleScrollToTarget);
      }
    };
  }, []);

  return (
    <header>
      <div id='sticky-header' className="menu-area ">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div
                className="mobile-nav-toggler"
                onClick={openMobileMenu}
                role="button"
                tabIndex={0}
                aria-label="Open mobile menu"
                onKeyPress={e => { if (e.key === 'Enter' || e.key === ' ') openMobileMenu(); }}
              >
                <i className="fas fa-bars" />
              </div>
              <div className="menu-wrap main-menu">
                <nav className="menu-nav">
                  <div className="logo"><a href="/#"><img src="assets/img/logo/decentra_logo2.png" alt="" /></a></div>
                  <div className="brand-text">
                    DECENTRAGRI
                  </div>
                  <div className="navbar-wrap push-menu main-menu d-none d-lg-flex">
                    <ul className="navigation">
                      <li><Link to="/">Home</Link></li>
                      <li><a href="/assets/whitepaper/whitepaper.pdf" target="_blank" rel="noopener noreferrer">Whitepaper</a></li>
                      <li><Link to="/about">About</Link></li>
                      <li><Link to="/contact">Contact</Link></li>
                    </ul>
                  </div>
                  <div className="header-action d-none d-md-block">
                    <ul>
                      <li className="theme-toggle">
                        <button 
                          className="theme-btn" 
                          onClick={toggleTheme} 
                          aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
                        >
                          <i className={`fas ${isDarkMode ? "fa-sun" : "fa-moon"}`} />
                        </button>
                      </li>

                    </ul>
                  </div>
                </nav>
              </div>
              {/* Mobile Menu  */}
              <div className="mobile-menu">
                <nav className="menu-box">
                  <div
                    className="close-btn"
                    onClick={closeMobileMenu}
                    role="button"
                    tabIndex={0}
                    aria-label="Close mobile menu"
                    onKeyPress={e => { if (e.key === 'Enter' || e.key === ' ') closeMobileMenu(); }}
                  >
                    <i className="fas fa-times" />
                  </div>
                  <div className="nav-logo"><a href="/#"></a>
                  </div>
                  <div className="menu-outer">
                    <div className="mobile-menu-header">
                      <div className="mobile-logo">
                        <img src="assets/img/logo/decentra_logo2.png" alt="Decentragri" /> <div className="brand-text">DECENTRAGRI</div>
                      </div>
                      <div className="mobile-theme-toggle">
                        <button 
                          className="theme-btn" 
                          onClick={() => { toggleTheme(); }}
                          aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                        >
                          <i className={`fas ${isDarkMode ? 'fa-sun' : 'fa-moon'}`} />
                        </button>
                      </div>
                    </div>
                    
                    <nav className="mobile-nav">
                      <ul className="navigation">
                        <li>
                          <Link to="/" onClick={closeMobileMenu} className="nav-link">
                            <i className="fas fa-home" />
                            <span>Home</span>
                          </Link>
                        </li>
                        <li>
                          <a 
                            href="https://decentragri.gitbook.io/decentragri.com/" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            onClick={closeMobileMenu}
                            className="nav-link"
                          >
                            <i className="fas fa-file-alt" />
                            <span>Whitepaper</span>
                          </a>
                        </li>
                        <li>
                          <Link to="/about" onClick={closeMobileMenu} className="nav-link">
                            <i className="fas fa-info-circle" />
                            <span>About</span>
                          </Link>
                        </li>
                        <li>
                          <Link to="/contact" onClick={closeMobileMenu} className="nav-link">
                            <i className="fas fa-envelope" />
                            <span>Contact</span>
                          </Link>
                        </li>
                      </ul>
                    </nav>
                    

                  </div>
                  <div className="social-links">
                    <h4 className="social-links-title">Follow us on:</h4>
                    <ul>
                      <li><a href="https://x.com/decentragri" target="_blank" rel="noopener noreferrer" style={{ background: '#3a3a3a', color: '#fff' }}><i className="fab fa-twitter" /></a></li>
                      <li><a href="https://www.facebook.com/profile.php?id=61577572165938" target="_blank" rel="noopener noreferrer" style={{ background: '#3a3a3a', color: '#fff' }}><i className="fab fa-facebook-f" /></a></li>
                      <li><a href="https://www.linkedin.com/in/decentr-agri-a598bb36b/" target="_blank" rel="noopener noreferrer" style={{ background: '#3a3a3a', color: '#fff' }}><i className="fab fa-linkedin-in" /></a></li>
                      <li><a href="https://www.youtube.com/@decentragri" target="_blank" rel="noopener noreferrer" style={{ background: '#3a3a3a', color: '#fff' }}><i className="fab fa-youtube" /></a></li>
                    </ul>
                  </div>
                </nav>
              </div>
              <div className="menu-backdrop" onClick={closeMobileMenu} />
              {/* End Mobile Menu */}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header