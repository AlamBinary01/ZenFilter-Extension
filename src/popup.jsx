import React, { useState } from "react";
import { render } from "react-dom";
import LandingPage from "./LandingPage.jsx";
import LoginForm from "./loginForm.jsx";
import App from "./App.jsx";
import './css/aboutus.css';
import Services from "./aboutus.jsx";
import Sidebar from "./Sidebar.jsx";
import Preferences from "./preferences.jsx";

function Popup() {
  
  const [showLoginForm, setShowLoginForm] = useState(false);

  const handleGetStartedClick = () => {
    setShowLoginForm(true);
  };

  const handleSignIn = () => {
    chrome.tabs.create({ url: './dashboard.html', active : true },  function(newTab) {
      console.log('New tab created:', newTab);
    });
  };

  return (
    <div>
      {!showLoginForm ? (
        <div>
          <LandingPage onGetStartedClick={handleGetStartedClick} />
        </div>
      ) : (
        <LoginForm onSignIn={handleSignIn} />
      )
      }
    </div>
  );
}

render(<Preferences/>, document.getElementById("react-target"));