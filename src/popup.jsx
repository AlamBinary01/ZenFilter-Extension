import React, { useState } from "react";
import { render } from "react-dom";
import LandingPage from "./LandingPage.jsx";
import LoginForm from "./LoginForm.jsx";

function Popup() {
  
  const [showLoginForm, setShowLoginForm] = useState(false);

  const handleGetStartedClick = () => {
    setShowLoginForm(true);
  };

  const handleSignIn = () => {
    chrome.tabs.create({ url: 'dashboard.html' });
  };

  return (
    <div>
      {!showLoginForm ? (
        <div>
          <LandingPage onGetStartedClick={handleGetStartedClick} />
        </div>
      ) : (
        <LoginForm onSignIn={handleSignIn} />
      )}
    </div>
  );
}

render(<Popup />, document.getElementById("react-target"));
