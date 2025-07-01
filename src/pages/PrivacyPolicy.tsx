import { useEffect } from 'preact/hooks';
import Header from '../Components/Header/Header';
import Footer from '../Components/Footer/Footer';
import SideBar from '../Components/IndexOne/SideBar';
import { useThemeStore } from '../context/ThemeContext';

const PrivacyPolicy = () => {
  const { isDarkMode } = useThemeStore();

  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className={`privacy-policy-page ${isDarkMode ? 'dark-mode' : ''}`}>
      <SideBar />
      <div className="main-content">
        <Header />
        
        {/* Hero Section */}
        <section className="privacy-hero">
          <div className="container">
            <div className="hero-content">
              <h1 className="title">
                Your Privacy <span className="text-accent">Matters</span>
              </h1>
              <p className="hero-subtitle">
                We are committed to protecting your personal information and being transparent about how we use it.
              </p>
            </div>
          </div>
        </section>

        <section className="privacy-policy-section">
          <div className="container">
            <div className="section-header text-center mb-5">
              <h2 className="section-title">
                <span>Privacy</span> <span className="text-accent">Policy</span>
              </h2>
              <p className="section-subtitle">Last Updated: June 26, 2025</p>
            </div>

            <div className="privacy-content">
              <div className="privacy-section mb-5">
                <h2 className="privacy-heading">1. Introduction</h2>
                <p className="privacy-text">
                  Welcome to DecentrAgri. We respect your privacy and are committed to protecting your personal data. 
                  This Privacy Policy will inform you about how we look after your personal data when you visit our website 
                  and tell you about your privacy rights and how the law protects you.
                </p>
              </div>

              <div className="privacy-section mb-5">
                <h2 className="privacy-heading">2. Information We Collect</h2>
                <p className="privacy-text">
                  We may collect, use, store, and transfer different kinds of personal data about you which we have grouped together as follows:
                </p>
                <ul className="privacy-list">
                  <li><strong>Identity Data</strong> includes first name, last name, username or similar identifier.</li>
                  <li><strong>Contact Data</strong> includes email address and telephone numbers.</li>
                  <li><strong>Technical Data</strong> includes internet protocol (IP) address, browser type and version, time zone setting and location, and other technology on the devices you use to access this website.</li>
                  <li><strong>Usage Data</strong> includes information about how you use our website and services.</li>
                </ul>
              </div>

              <div className="privacy-section mb-5">
                <h2 className="privacy-heading">3. How We Use Your Data</h2>
                <p className="privacy-text">
                  We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
                </p>
                <ul className="privacy-list">
                  <li>To register you as a new customer</li>
                  <li>To manage our relationship with you</li>
                  <li>To administer and protect our business and this website</li>
                  <li>To deliver relevant website content and advertisements to you</li>
                  <li>To use data analytics to improve our website, products/services, marketing, and user experiences</li>
                </ul>
              </div>

              <div className="privacy-section mb-5">
                <h2 className="privacy-heading">4. Data Security</h2>
                <p className="privacy-text">
                  We have implemented appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way, altered, or disclosed.
                </p>
              </div>

              <div className="privacy-section mb-5">
                <h2 className="privacy-heading">5. Your Legal Rights</h2>
                <p className="privacy-text">
                  Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to:
                </p>
                <ul className="privacy-list">
                  <li>Request access to your personal data</li>
                  <li>Request correction of your personal data</li>
                  <li>Request erasure of your personal data</li>
                  <li>Object to processing of your personal data</li>
                  <li>Request restriction of processing your personal data</li>
                  <li>Request transfer of your personal data</li>
                  <li>Right to withdraw consent</li>
                </ul>
              </div>

              <div className="privacy-section">
                <h2 className="privacy-heading">6. Contact Us</h2>
                <p className="privacy-text">
                  If you have any questions about this Privacy Policy or our privacy practices, please contact us at:
                </p>
                <p className="privacy-text">
                  Email: <a href="mailto:privacy@decentragri.com" className="text-primary">hello@decentragri.com</a>
                </p>
              </div>
            </div>
          </div>
        </section>
        
        <Footer />
      </div>
    </div>
  );
};

export default PrivacyPolicy;
