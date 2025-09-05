import { useEffect } from 'preact/hooks';
import Header from '../Components/Header/Header';
import Footer from '../Components/Footer/Footer';
import SideBar from '../Components/IndexOne/SideBar';
import FarmDashboard from '../Components/Farm/FarmDashboard';
import { useThemeStore } from '../context/ThemeContext';

export default function FarmDashboardPage() {
  const { isDarkMode } = useThemeStore();

  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className={`farm-dashboard-page ${isDarkMode ? 'dark-mode' : ''}`}>
      <SideBar />
      <div className="main-content">
        <Header />
        <FarmDashboard />
      </div>
      <Footer />
    </div>
  );
}
