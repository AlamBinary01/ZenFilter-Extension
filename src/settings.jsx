import React, { useState, useEffect } from 'react';
import './setting.css';

const SettingsPage = () => {
  const [userData, setUserData] = useState({
    ud:""
  });

  useEffect(() => {
    fetch("http://localhost:5000/userData", {
      method: "POST",
      crossDomain: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({
        token: window.localStorage.getItem("token"),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "userData");
        setUserData({ud: data.data});
      });
  }, []);

  return (
    <div style={containerStyle}>
      <h2 style={pageTitleStyle}>Settings</h2>

      {/* User Information Section */}
      <div style={userInfoContainerStyle}>
        <div style={profilePictureStyle}> {/* Add your profile picture here */}</div>
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
        <button class='buttonStyle'>Account    {'>'}</button>
        <button class='buttonStyle'>Logout              {'>'}</button>
        <button class='buttonStyle'>Delete Account      {'>'}</button>
      </div>

      {/* Feedback Section */}
      <div style={sectionStyle}>
        <h3 style={sectionTitleStyle}>Feedback</h3>
        <button class='buttonStyle'>Report a Bug        {'>'}</button>
        <button class='buttonStyle'>Send Feedback       {'>'}</button>
      </div>
    </div>
  );
};

const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'flex-start',
  padding: '20px',
  height: '100vh', // Ensures the content takes at least the full height of the viewport
  paddingLeft: '500px',
};

const pageTitleStyle = {
  borderBottom: '3px solid #000000',
  borderRadius: '15px',
  padding: '8px',
  color: '#F79817',
  fontWeight : 'bold'
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
  backgroundColor: '#ddd', // Replace with the actual profile picture or background color
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
