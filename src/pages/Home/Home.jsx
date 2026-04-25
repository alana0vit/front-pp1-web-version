import { useRef } from 'react';
import AppPromo from '../../components/AppPromo';
import HeroSection from '../../components/HeroSection';
import HowItWorks from '../../components/HowItWorks';

function Home() {
  const howItWorksRef = useRef(null);

  const scrollToHowItWorks = () => {
    howItWorksRef.current?.scrollIntoView({ behavior: 'smooth', block:'center' });
  };

  return (
    <>
      <HeroSection onScrollClick={scrollToHowItWorks} />
      
      <div ref={howItWorksRef}>
        <HowItWorks />
      </div>

      <AppPromo />
    </>
  );
}

export default Home;