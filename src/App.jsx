import React, { useState } from 'react';
import './css/App.css';
import Header from './Header.jsx';
import Sidebar from './Sidebar.jsx';
import Home from './Home.jsx';
import Preferences from './preferences.jsx';
import Services from './aboutus.jsx';
import BlockedAppsPage from './blockedapps.jsx';

function App() {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  const [showAboutPage, setAboutPage] = useState(false);
  const [showPreferencesPage, setPreferencesPage] = useState(false);
  const [showBlockedPage, setBlockedPage] = useState(false);

  const toggleSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  const handlePreferencesClick = () => {
    console.log("Navigating to Preferences");
    setAboutPage(false);
    setPreferencesPage(true);
    setBlockedPage(false);
    toggleSidebar(); 
};

  const handleAboutClick = () => {
    setAboutPage(true);
    setPreferencesPage(false); // Make sure to set showPreferencesPage to false
    setBlockedPage(false);
    toggleSidebar();
};

  const handleBlockClick = () => {
    console.log("Navigating to block web");
    setAboutPage(false);
    setPreferencesPage(false);
    setBlockedPage(true);
    toggleSidebar();
  }

  return (
    <div className='grid-container'>
      <Header toggleSidebar={toggleSidebar} />
      <Sidebar handleAboutClick={handleAboutClick} handlePreferencesClick={handlePreferencesClick} handleBlockClick={handleBlockClick}/>
      {showAboutPage ? <Services /> : null}
      {showPreferencesPage ? <Preferences /> : null}
      {showBlockedPage ? <BlockedAppsPage/> : null}
      {!showAboutPage && !showPreferencesPage  && !showBlockedPage ? <Home /> : null}
    </div>
  );
}

export default App;
