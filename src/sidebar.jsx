import React from 'react'
import 
{BsCart3, BsGrid1X2Fill, BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, 
  BsListCheck, BsMenuButtonWideFill, BsFillGearFill}
 from 'react-icons/bs'
 import styled from "styled-components";

 const StyledImage = styled.img`
 position: absolute; // Position the image absolutely within the container
 top: 10px; // Align to the top
 left: 10px; // Align to the left
 width: 15%; // Set the width to 100% to make it responsive
 height: 15%; // Set the maximum height if needed
 object-fit: contain; // Maintain the aspect ratio while covering the container
`;

 function Sidebar({ openSidebarToggle, toggleSidebar, handleAboutClick, handlePreferencesClick, handleBlockClick, handleBlockWebsites, handleSettings}) {
  return (
    <aside id="sidebar" className={openSidebarToggle ? "sidebar-responsive": ""}>
        <div className='sidebar-title'>
            <div className='sidebar-brand'>
                <StyledImage src="/images/whitetxt.png" alt = 'logo'/>
            </div>
            <span className='icon close_icon' onClick={toggleSidebar}>X</span>
        </div>

        <ul className='sidebar-list'>
            <li className='sidebar-list-item'>
                <a href="">
                    <BsGrid1X2Fill className='icon'/> Dashboard
                </a>
            </li>
            <li className='sidebar-list-item' onClick={handlePreferencesClick}>
                <a href="">
                    <BsFillArchiveFill className='icon' /> Preferences
                </a>
            </li>
            <li className='sidebar-list-item' onClick={handleBlockWebsites}>
                <a href="">
                    <BsPeopleFill className='icon'/> Block Website
                </a>
            </li>
            <li className='sidebar-list-item' onClick={handleBlockClick}>
                <a href="">
                    <BsListCheck className='icon'/> History
                </a>
            </li>
            <li className='sidebar-list-item' onClick= {handleAboutClick}>
                    <BsMenuButtonWideFill className='icon'/> About
            </li>
            <li className='sidebar-list-item' onClick={handleSettings}>
                <a href="">
                    <BsFillGearFill className='icon'/> Settings
                </a>
            </li>
        </ul>
    </aside>
  )
}

export default Sidebar;
