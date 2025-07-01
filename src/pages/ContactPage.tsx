import Header from '../Components/Header/Header';
import Footer from '../Components/Footer/Footer';
import SideBar from '../Components/IndexOne/SideBar';
import Contact from '@components/Contact/Contact';

const founderImg = 'https://www.decentragri.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Ftrevin_round.f4459cda.png&w=1920&q=75';
const aboutImgs = [
  'https://www.decentragri.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcow_about.d89bed58.png&w=1920&q=75',
  'https://www.decentragri.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Ffield_about.c5f6d574.png&w=750&q=75',
  'https://www.decentragri.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcoco_about.7a7c3748.png&w=750&q=75',
];

export default function ContactPage() {
  return (
    <>
      <SideBar />
      <div className="main-content">
        
        <Header />
        
        <Contact />
      </div>
      <Footer />
    </>
  );
}
