import AreaBg from './AreaBg'
import Banner from './Banner'
import DesignNews from './DesignNews'
import ExploreProduct from './ExploreProduct'
import LatestNews from './LatestNews'
import Testimonial from './Testimonial'
import TopCollection from './TopCollection'
import NarrativeSection from './NarrativeSection'
import FieldCarousel from './FieldCarousel'
import DecentragriFeatures from './DecentragriFeatures'
import Partnerships from './Partnerships'
import CallToAction from '../Common/CallToAction'
import FAQ from '../Common/FAQ'
import './IndexOne.css'


const IndexOne = () => {
  return (
    <main>
        <Banner/>
        
        <NarrativeSection />
        <DecentragriFeatures />
        <FieldCarousel />
        <Partnerships />

        <FAQ />
        <CallToAction 
          title="Ready to Get Started?"
          subtitle="Join our community of farmers and start transforming your agricultural practices today"
          primaryButtonText="Sign Up Now"
          primaryButtonLink="/contact"
        />
        {/* <TopCollection/>
        <AreaBg/>
        <ExploreProduct/>
        <LatestNews/>
        <DesignNews/>
        <Testimonial/> */}
    </main>
  )
}

export default IndexOne