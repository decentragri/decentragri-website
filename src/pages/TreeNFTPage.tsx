import Header from '../Components/Header/Header';
import Footer from '../Components/Footer/Footer';
import SideBar from '../Components/IndexOne/SideBar';
import TreeNFTs from '@components/TreeNFT/TreeNFTs';


export default function TreeNFTPage() {
  return (
    <>
      <SideBar />
      <div className="main-content">
  
        <Header />
        <TreeNFTs />
      </div>
      <Footer />
    </>
  );
}
