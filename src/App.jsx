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

  const toggleSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  const handlePreferencesClick = () => {
    setAboutPage(false);
    setPreferencesPage(true);
    setBlockedPage(false);
    setBlockedWebsites(false);
    setSettings(false);
    toggleSidebar();
  };

  const handleAboutClick = () => {
    setAboutPage(true);
    setPreferencesPage(false);
    setBlockedPage(false);
    setBlockedWebsites(false);
    setSettings(false);
    toggleSidebar();
  };

  const handleBlockClick = () => {
    setAboutPage(false);
    setPreferencesPage(false);
    setBlockedPage(true);
    setBlockedWebsites(false);
    setSettings(false);
    toggleSidebar();
  };

  const handleBlockWebsites = () => {
    setAboutPage(false);
    setBlockedPage(false);
    setPreferencesPage(false);
    setBlockedWebsites(true);
    setSettings(false);
  };

  const handleSettings = () => {
    setAboutPage(false);
    setBlockedPage(false);
    setPreferencesPage(false);
    setBlockedWebsites(false);
    setSettings(true);
  };

  const handleAddCustomPreference = () => {
    // Handle redirection or additional logic when the "+" button is clicked
    // For now, let's redirect to the BlockWebsitesPage
    handleBlockWebsites();
  };

  return (
    <div className='grid-container'>
      <Header toggleSidebar={toggleSidebar} />
      <Sidebar
        handleAboutClick={handleAboutClick}
        handlePreferencesClick={handlePreferencesClick}
        handleBlockClick={handleBlockClick}
        handleBlockWebsites={handleBlockWebsites}
        handleSettings={handleSettings}
        handleAddCustomPreference={handleAddCustomPreference}
      />
      {showAboutPage ? <Services /> : null}
      {showPreferencesPage ? <Preferences /> : null}
      {showBlockedPage ? <BlockedAppsPage /> : null}
      {showBlockedWebsites ? <BlockWebsitesPage /> : null}
      {showSettings ? <SettingsPage /> : null}
      {!showAboutPage && !showPreferencesPage && !showBlockedPage && !showBlockedWebsites && !showSettings ? (
        <Home />
      ) : null}
    </div>
  );
}

export default App;
