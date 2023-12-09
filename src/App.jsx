import React, { useState } from 'react';
import './css/App.css';
import Header from './Header.jsx';
import Home from './Home.jsx';
import Sidebar from './Sidebar.jsx';

function App() {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(true);

  const toggleSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  return (
    <div className='grid-container'>
      <Header toggleSidebar={toggleSidebar} />
      <Sidebar openSidebarToggle={openSidebarToggle} toggleSidebar={toggleSidebar} />
      <Home />
    </div>
  );
}

export default App;
