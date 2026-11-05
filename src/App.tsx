/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LandingPage } from './components/LandingPage.tsx';
import { LoginPage } from './components/LoginPage.tsx';
import { WelcomeKathiparaScene } from './components/WelcomeKathiparaScene.tsx';
import { MobilityExplorer } from './components/MobilityExplorer.tsx';

type ScreenType = 'landing' | 'login' | 'welcome' | 'explorer';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('landing');
  const [language, setLanguage] = useState<'EN' | 'TA'>('EN');
  const [user, setUser] = useState<{
    name: string;
    email: string;
    role: 'commuter' | 'planner';
    ward: string;
  }>({
    name: 'Ananya Raman',
    email: 'commuter@movefair.in',
    role: 'commuter',
    ward: 'Ward 114 (Nungambakkam)',
  });

  const [explorerTab, setExplorerTab] = useState<
    'explorer' | 'planner' | 'saved' | 'spending' | 'plannertools'
  >('explorer');

  // Synchronize document lang attribute for accessibility and optimal Tamil font rendering
  React.useEffect(() => {
    document.documentElement.lang = language === 'TA' ? 'ta' : 'en';
  }, [language]);

  // Handler for login success
  const handleLoginSuccess = (userData: {
    name: string;
    email: string;
    role: 'commuter' | 'planner';
    ward: string;
  }) => {
    setUser(userData);
    // After login, show the signature Kathipara live time-reactive simulation screen
    setCurrentScreen('welcome');
  };

  return (
    <div className="w-full min-h-screen overflow-x-hidden bg-[#F6F7F4]">
      <AnimatePresence mode="wait">
        {/* 1. Public Landing Page */}
        {currentScreen === 'landing' && (
          <motion.div
            key="landing"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <LandingPage
              onLaunchApp={() => setCurrentScreen('welcome')}
              onLoginClick={() => setCurrentScreen('login')}
              language={language}
              setLanguage={setLanguage}
            />
          </motion.div>
        )}

        {/* 2. Login / Register Page */}
        {currentScreen === 'login' && (
          <motion.div
            key="login"
            initial={{ opacity: 0, scale: 0.98, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -16 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <LoginPage
              onBackToHome={() => setCurrentScreen('landing')}
              onLoginSuccess={handleLoginSuccess}
              language={language}
              setLanguage={setLanguage}
            />
          </motion.div>
        )}

        {/* 3. Signature Kathipara Junction Time-Aware Live Simulation Scene */}
        {currentScreen === 'welcome' && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            <WelcomeKathiparaScene
              userName={user.name}
              onOpenExplorer={() => {
                setExplorerTab('explorer');
                setCurrentScreen('explorer');
              }}
              onPlanJourney={() => {
                setExplorerTab('planner');
                setCurrentScreen('explorer');
              }}
              onSavedRoutes={() => {
                setExplorerTab('saved');
                setCurrentScreen('explorer');
              }}
              onCommuteSpending={() => {
                setExplorerTab('spending');
                setCurrentScreen('explorer');
              }}
              onBackToLanding={() => setCurrentScreen('landing')}
              language={language}
              setLanguage={setLanguage}
            />
          </motion.div>
        )}

        {/* 4. Authenticated Mobility Explorer Main Application */}
        {currentScreen === 'explorer' && (
          <motion.div
            key="explorer"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <MobilityExplorer
              userName={user.name}
              userWard={user.ward}
              onOpenWelcomeScene={() => setCurrentScreen('welcome')}
              onLogout={() => setCurrentScreen('landing')}
              language={language}
              setLanguage={setLanguage}
              initialTab={explorerTab}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
