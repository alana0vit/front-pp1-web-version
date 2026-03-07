import React from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import HowItWorks from './components/HowItWorks';
import AppPromo from './components/AppPromo';
import Footer from './components/Footer';

function App() {
  return (
    <div>
      <Header />
      <HeroSection />
      <HowItWorks />
      <AppPromo />
      <Footer />
    </div>
  );
}

export default App;