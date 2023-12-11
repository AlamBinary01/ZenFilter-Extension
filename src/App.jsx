import React, { useState } from 'react';
import './css/App.css';
import Header from './Header.jsx';
import Sidebar from './Sidebar.jsx';
import Home from './Home.jsx';
import Services from './aboutus.jsx';
function App() {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  const [showAboutPage, setAboutPage] = useState(false);

  const toggleSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  return (
    <div className='grid-container'>
      <Header toggleSidebar={toggleSidebar} />
      <Sidebar  setAboutPage={setAboutPage} />
      {showAboutPage ? <Services /> : <Home />}
    </div>
  );
}

export default App;
