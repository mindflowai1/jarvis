import React from 'react';
import LandingPageNavbar from './LandingPageNavbar';
import LandingPageHero from './LandingPageHero';
import LandingPageFeatures from './LandingPageFeatures';
import LandingPageShowcase from './LandingPageShowcase';
import LandingPageSmartReminders from './LandingPageSmartReminders';
import LandingPageDashboard from './LandingPageDashboard';
import LandingPagePricing from './LandingPagePricing';
import LandingPageFooter from './LandingPageFooter';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-background-ocean text-white font-body selection:bg-primary selection:text-background-ocean overflow-x-hidden">
            <LandingPageNavbar />
            <main>
                <LandingPageHero />
                <LandingPageFeatures />
                <LandingPageShowcase />
                <LandingPageSmartReminders />
                <LandingPageDashboard />
                <LandingPagePricing />
            </main>
            <LandingPageFooter />
        </div>
    );
};

export default LandingPage;
