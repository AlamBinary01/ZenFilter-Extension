// ForgotPasswordPopup.jsx
import React, { useState } from 'react';
import './css/fp.css'; // Import the corresponding CSS file
import { render } from "react-dom";

const ForgotPasswordPopup = ({ onClose }) => {
  const [state, setState] = useState({
    email: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const { email } = state;
    console.log('Email submitted:', email);
    fetch("http://localhost:5000/forgotPassword", {
      method: "POST",
      crossDomain: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({
        email: email,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "userData");
        alert(data.status);
      });
  };

  return (
    <div className="popup-container">
      <div className="popup-box">
        <button className="back-button" onClick={onClose}>
          Back
        </button>
        <h2>Forgot Password?</h2>
        <input
          type="text"
          placeholder="Enter your email"
          className="input-box"
          value={state.email}
          onChange={(e) => setState({ ...state, email: e.target.value })}
        />
        <button className="submit-button" onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
};

export default ForgotPasswordPopup;