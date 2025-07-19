import { useEffect } from 'preact/hooks';
import Footer from '../Components/Footer/Footer';
import Header from '../Components/Header/Header';
import IndexOne from '../Components/IndexOne/IndexOne';
import SideBar from '../Components/IndexOne/SideBar';

const Home = () => {
  useEffect(() => {
    // Any initialization code can go here
  }, []);

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