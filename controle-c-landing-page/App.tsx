import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Showcase from './components/Showcase';
import SmartReminders from './components/SmartReminders';
import Dashboard from './components/Dashboard';
import Pricing from './components/Pricing';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-background-ocean text-white font-body selection:bg-primary selection:text-background-ocean overflow-x-hidden">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Showcase />
        <SmartReminders />
        <Dashboard />
        <Pricing />
      </main>
      <Footer />
    </div>
  );
}

export default App;