import React, { useState, useEffect } from 'react';
import './setting.css';
import AccountSettings from './AccountSettings.jsx'; // Ensure the path is correct
import Feedback from './Feedback.jsx'; // Import the Feedback component
import ReportBug from './RPBug.jsx'; // Import the ReportBug component

const SettingsPage = () => {
  const [userData, setUserData] = useState({ ud: "" });
  const [showAccountSettings, setShowAccountSettings] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  const [showReportBug, setShowReportBug] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5000/userData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({ token: window.localStorage.getItem("token") }),
    })
    .then(res => res.json())
    .then(data => {
      setUserData({ ud: data.data });
    });
  }, []);

  const handleLogout = () => {
    window.localStorage.clear();
    window.close(); // Closes the browser tab
  };

  const handleDeleteAccount = () => {
    // Placeholder for account deletion logic
    alert('Account deletion functionality not implemented.');
  };

  // Handle showing the feedback form
  const handleShowFeedback = () => {
    setShowFeedback(true);
  };

  // Handle showing the bug report form
  const handleShowReportBug = () => {
    setShowReportBug(true);
  };

  // Optionally handle going back from feedback to settings
  const handleBackToSettings = () => {
    setShowFeedback(false);
    setShowReportBug(false);
  };

  if (showAccountSettings) {
    return <AccountSettings onBack={handleBackToSettings} />;
  }

  if (showFeedback) {
    return <Feedback onBack={handleBackToSettings} />;
  }

  if (showReportBug) {
    return <ReportBug onBack={handleBackToSettings} />;
  }

  return (
    <div style={containerStyle}>
      <h2 style={pageTitleStyle}>Settings</h2>

      {/* User Information Section */}
      <div style={userInfoContainerStyle}>
        <div style={profilePictureStyle}></div>
        <div style={userInfoStyle}>
          {userData.ud ? (
            <>
              <p style={userNameStyle}>{userData.ud.name}</p>
              <p style={userEmailStyle}>{userData.ud.email}</p>
            </>
          ) : (
            <p>Loading user data...</p>
          )}
        </div>
      </div>

      {/* General Settings Section */}
      <div style={sectionStyle}>
        <h3 style={sectionTitleStyle}>General</h3>
        <button className='buttonStyle' onClick={() => setShowAccountSettings(true)}>Account {'>'}</button>
        <button className='buttonStyle' onClick={() => setShowLogoutModal(true)}>Logout {'>'}</button>
        <button className='buttonStyle' onClick={() => setShowDeleteAccountModal(true)}>Delete Account {'>'}</button>
      </div>

      {/* Feedback Section */}
      <div style={sectionStyle}>
        <h3 style={sectionTitleStyle}>Feedback</h3>
        <button className='buttonStyle' onClick={handleShowReportBug}>Report a Bug {'>'}</button>
        <button className='buttonStyle' onClick={handleShowFeedback}>Send Feedback {'>'}</button>
      </div>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="modal">
          <div className="modal-content">
            <p>Are you sure?</p>
            <button onClick={handleLogout}>Yes</button>
            <button onClick={() => setShowLogoutModal(false)}>No</button>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDeleteAccountModal && (
        <div className="modal">
          <div className="modal-content">
            <p>Do you really want to delete your account?</p>
            <button onClick={handleDeleteAccount}>Yes</button>
            <button onClick={() => setShowDeleteAccountModal(false)}>No</button>
          </div>
        </div>
      )}
    </div>
  );
};

// Style definitions
const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'flex-start',
  padding: '20px',
  height: '100vh',
  paddingLeft: '500px',
};

const pageTitleStyle = {
  borderBottom: '3px solid #000000',
  borderRadius: '15px',
  padding: '8px',
  color: '#F79817',
  fontWeight: 'bold'
};

const userInfoContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  margin: '20px 0',
};

const profilePictureStyle = {
  width: '50px',
  height: '50px',
  borderRadius: '50%',
  backgroundColor: '#ddd',
  marginBottom: '10px',
};

const userInfoStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

const userNameStyle = {
  marginBottom: '5px',
  fontWeight: 'bold',
};

const userEmailStyle = {
  color: '#666',
};

const sectionStyle = {
  marginTop: '20px',
  textAlign: 'center',
};

const sectionTitleStyle = {
  fontSize: '18px',
  marginBottom: '10px',
};

export default SettingsPage;
