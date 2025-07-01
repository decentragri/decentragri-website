import { useEffect } from 'preact/hooks';
import { useThemeStore } from '@context/ThemeContext';
import { useAuthContext } from '@context/AuthContext';
import DashboardHeader from '@components/Dashboard/DashboardHeader';
import SideBar from '@components/IndexOne/SideBar';
import DecentragriLoader from '@components/IndexOne/DecentragriLoader';
import WeatherForecastComponent from '@components/Weather/WeatherForecast';


const WeatherForecast = () => {
  const { user, isAuthenticated, loading, logout } = useAuthContext();
  const { isDarkMode } = useThemeStore();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      window.location.href = '/';
    }
  }, [isAuthenticated, loading, user]);

  if (loading) {
    return <DecentragriLoader />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="main-wrapper">
      <SideBar />
      <div className={`dashboard-container ${isDarkMode ? 'dark-mode' : ''}`}>
        <DashboardHeader user={user || undefined} />
        <div className="dashboard-content">
          <WeatherForecastComponent />
        </div>
      </div>
    </div>
  );
};

export default WeatherForecast;
