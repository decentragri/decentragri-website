import Banner from './Banner'
import NarrativeSection from './NarrativeSection'
import TokenizationSection from './TokenizationSection'
import FieldCarousel from './FieldCarousel'
import DecentragriFeatures from './DecentragriFeatures'
import Partnerships from './Partnerships'
import RoadmapSection from './RoadmapSection'
import CallToAction from '../Common/CallToAction'
import FAQ from '../Common/FAQ'
import './IndexOne.css'


const IndexOne = () => {
  return (
    <main>
        <Banner/>
        
        <NarrativeSection />
        <TokenizationSection />
        <DecentragriFeatures />
        <FieldCarousel />
        <RoadmapSection />
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