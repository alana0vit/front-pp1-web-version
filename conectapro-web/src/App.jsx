import React from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import HowItWorks from './components/HowItWorks';
import AppPromo from './components/AppPromo';
import Footer from './components/Footer';

import './App.css'; 

function App() {
  return (
    <div className="App">
      <Header />
      <HeroSection />
      <HowItWorks />
      <AppPromo />
      <Footer />
    </div>
  );
}

export default App;