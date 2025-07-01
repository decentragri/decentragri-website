import { useEffect, useState } from 'preact/hooks';
// Remove preact-router import since we're using window.location directly
import DecentragriLoader from '../Components/IndexOne/DecentragriLoader';
import Footer from '../Components/Footer/Footer';
import Header from '../Components/Header/Header';
import IndexOne from '../Components/IndexOne/IndexOne';
import SideBar from '../Components/IndexOne/SideBar';
import { useAuthContext } from '../context/AuthContext';

const Home = () => {
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, loading: authLoading } = useAuthContext();

  useEffect(() => {
    // First check if auth is done loading
    if (!authLoading) {
      // If user is authenticated, redirect to dashboard
      if (isAuthenticated) {
        window.location.href = '/dashboard';
      } else {
        // If not authenticated, finish loading the home page
        const timer = setTimeout(() => setLoading(false), 2000);
        return () => clearTimeout(timer);
      }
    }
  }, [isAuthenticated, authLoading]);

  // Show loader while checking auth or during page transition
  if (loading || authLoading) return <DecentragriLoader />;

  // If not authenticated, show the regular home page
  return (
    <>
      <SideBar/>
      <div className="main-content">
        <Header/>
        <IndexOne/>
      </div>
      <Footer/>
    </>
  );
};

export default Home;