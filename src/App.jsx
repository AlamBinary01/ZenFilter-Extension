import React, { useState } from 'react';
import './css/App.css';
import Header from './Header.jsx';
import Sidebar from './Sidebar.jsx';
import Home from './Home.jsx';
import Preferences from './preferences.jsx';
import Services from './aboutus.jsx';
import BlockedAppsPage from './blockedapps.jsx';
import BlockWebsitesPage from './blockedWebistes.jsx';

function App() {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  const [showAboutPage, setAboutPage] = useState(false);
  const [showPreferencesPage, setPreferencesPage] = useState(false);
  const [showBlockedPage, setBlockedPage] = useState(false);
  const [showBlockedWebsites, setBlockedWebsites] = useState(false);

  const toggleSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  const handlePreferencesClick = () => {
    console.log("Navigating to Preferences");
    setAboutPage(false);
    setPreferencesPage(true);
    setBlockedPage(false);
    setBlockedWebsites(false);
    toggleSidebar(); 
};

  const handleAboutClick = () => {
    setAboutPage(true);
    setPreferencesPage(false); // Make sure to set showPreferencesPage to false
    setBlockedPage(false);
    setBlockedWebsites(false);
    toggleSidebar();
};

  const handleBlockClick = () => {
    console.log("Navigating to block web");
    setAboutPage(false);
    setPreferencesPage(false);
    setBlockedPage(true);
    setBlockedWebsites(false);
    toggleSidebar();
  }

  const handleBlockWebsites = () => {
    console.log("Navigating to blocked website page");
    setAboutPage(false);
    setBlockedPage(false);
    setPreferencesPage(false);
    setBlockedWebsites(true);
  }

  return (
    <div className='grid-container'>
      <Header toggleSidebar={toggleSidebar} />
      <Sidebar handleAboutClick={handleAboutClick} handlePreferencesClick={handlePreferencesClick} handleBlockClick={handleBlockClick} handleBlockWebsites={handleBlockWebsites}/>
      {showAboutPage ? <Services /> : null}
      {showPreferencesPage ? <Preferences /> : null}
      {showBlockedPage ? <BlockedAppsPage/> : null}
      {showBlockedWebsites ? <BlockWebsitesPage/> : null}
      {!showAboutPage && !showPreferencesPage  && !showBlockedPage && !showBlockedWebsites ? <Home /> : null}
    </div>
  );
}

export default App;
