import { useRef } from 'react';
import AppPromo from '../../components/AppPromo';
import HeroSection from '../../components/HeroSection';
import HowItWorks from '../../components/HowItWorks';

function Home() {
  // Criamos a referência que aponta para onde queremos rolar
  const howItWorksRef = useRef(null);

  // Função que faz o scroll suave até a referência
  const scrollToHowItWorks = () => {
    howItWorksRef.current?.scrollIntoView({ behavior: 'smooth', block:'center' });
  };

  return (
    <>
      {/* Passamos a função para o HeroSection via prop */}
      <HeroSection onScrollClick={scrollToHowItWorks} />
      
      {/* Marcamos o HowItWorks como o destino do scroll */}
      <div ref={howItWorksRef}>
        <HowItWorks />
      </div>

      <AppPromo />
    </>
  );
}

export default Home;