// WelcomePage.jsx

import React, { useState } from "react";
import styled from "styled-components";

const WelcomeContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start; /* Align items to the start (left) */
  justify-content: center;
  min-height: 100vh;
  padding: 10px; /* Add padding to create space for the ToggleButton */
  background-color: #000000;
  color: #f79817;
`;

const ToggleButton = styled.button`
  position: absolute;
  top: 10px;
  left: -180px;
  background-color: transparent;
  border: none;
  color: #f79817;
  font-size: 24px;
  cursor: pointer;
`;

const Sidebar = styled.div`
  position: fixed;
  top: 60px; /* Adjust the top value as needed */
  left: ${({ isOpen }) => (isOpen ? "0" : "-250px")};
  width: 250px;
  height: calc(100% - 60px); /* Adjust the height value as needed */
  background-color: #000000;
  transition: left 0.3s ease-in-out;
`;

const SidebarButton = styled.button`
  background-color: transparent;
  border: none;
  color: #f79817;
  font-size: 16px;
  margin: 10px;
  cursor: pointer;
`;

const WelcomePage = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <WelcomeContainer>
      <ToggleButton onClick={toggleSidebar}>☰</ToggleButton>
      <h1>Welcome to Zen-Filter</h1>
      <Sidebar isOpen={isSidebarOpen}>
        <SidebarButton>Options</SidebarButton>
        <SidebarButton>Preferences</SidebarButton>
        <SidebarButton>Help</SidebarButton>
        <SidebarButton>About Me</SidebarButton>
      </Sidebar>
    </WelcomeContainer>
  );
};

export default WelcomePage;
