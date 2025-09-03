import { useEffect } from 'preact/hooks';
import Header from '../Components/Header/Header';
import Footer from '../Components/Footer/Footer';
import SideBar from '../Components/IndexOne/SideBar';
import FarmList from '../Components/Farm/FarmList';
import { useThemeStore } from '../context/ThemeContext';

export default function FarmListPage() {
  const { isDarkMode } = useThemeStore();

  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className={`farm-list-page ${isDarkMode ? 'dark-mode' : ''}`}>
      <SideBar />
      <div className="main-content">
        <Header />
        <FarmList />
      </div>
      <Footer />
    </div>
  );
}
