import React, { useState } from 'react';
import './css/App.css';
import Header from './Header.jsx';
import Sidebar from './Sidebar.jsx';
import Home from './Home.jsx';
import Preferences from './preferences.jsx';
import Services from './aboutus.jsx';
import BlockedAppsPage from './blockedapps.jsx';
import BlockWebsitesPage from './blockedWebistes.jsx';
import SettingsPage from './settings.jsx';

function App() {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  const [showAboutPage, setAboutPage] = useState(false);
  const [showPreferencesPage, setPreferencesPage] = useState(false);
  const [showBlockedPage, setBlockedPage] = useState(false);
  const [showBlockedWebsites, setBlockedWebsites] = useState(false);
  const [showSettings, setSettings] = useState(false);
  const [showHistoryPage, setShowHistoryPage] = useState(false);

  const toggleSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  const handleNavigation = (page) => {
    // Reset all page states
    setAboutPage(false);
    setPreferencesPage(false);
    setBlockedPage(false);
    setShowHistoryPage(false);
    setBlockedWebsites(false);
    setSettings(false);

    // Set the requested page to true
    switch(page) {
      case 'about':
        setAboutPage(true);
        break;
      case 'preferences':
        setPreferencesPage(true);
        break;
      case 'blockedApps':
        setBlockedPage(true);
        break;
      case 'blockedWebsites':
        setBlockedWebsites(true);
        break;
      case 'settings':
        setSettings(true);
        break;
      case 'history':
        setShowHistoryPage(true);
        break;
      default:
        // No default action
    }
    
    toggleSidebar(); // Optionally toggle sidebar state
  };

  return (
    <div className='grid-container'>
      <Header toggleSidebar={toggleSidebar} />
      <Sidebar
        handleAboutClick={() => handleNavigation('about')}
        handlePreferencesClick={() => handleNavigation('preferences')}
        handleBlockClick={() => handleNavigation('blockedApps')}
        handleBlockWebsites={() => handleNavigation('blockedWebsites')}
        handleSettings={() => handleNavigation('settings')}
        handleAddCustomPreference={() => handleNavigation('blockedWebsites')} // Assuming this should navigate to blocked websites
        handleShowHistoryPage={() => handleNavigation('history')}
      />
      {showAboutPage && <Services />}
      {showPreferencesPage && <Preferences />}
      {showBlockedPage && <BlockedAppsPage />}
      {showBlockedWebsites && <BlockWebsitesPage />}
      {showSettings && <SettingsPage />}
      {showHistoryPage && <BlockedAppsPage />}
      {!showAboutPage && !showPreferencesPage && !showBlockedPage && !showBlockedWebsites && !showSettings && !showHistoryPage && (
        <Home onShowHistory={() => handleNavigation('history')} />
      )}
    </div>
  );
}

export default App;
