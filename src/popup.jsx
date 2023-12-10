import React, { useState } from "react";
import { render } from "react-dom";
import LandingPage from "./LandingPage.jsx";
import LoginForm from "./loginForm.jsx";
import App from "./App.jsx";

function Popup() {
  
  const [showLoginForm, setShowLoginForm] = useState(false);

  const handleGetStartedClick = () => {
    setShowLoginForm(true);
  };

  const handleSignIn = () => {
    chrome.tabs.create({ url: './dashboard.html', active : true },  function(newTab) {
      console.log('New tab created:', newTab);
      // Handle the details of the new tab
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

render(<Popup/>, document.getElementById("react-target"));
