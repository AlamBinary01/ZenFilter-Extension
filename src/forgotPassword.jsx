// ForgotPasswordPopup.jsx
import React from 'react';
import './css/fp.css'; // Import the corresponding CSS file

const ForgotPasswordPopup = ({ onClose }) => {
  return (
    <div className="popup-container">
      <div className="popup-box">
        <button className="back-button" onClick={onClose}>
          Back
        </button>
        <h2>Forgot Password?</h2>
        <input type="text" placeholder="Enter your email" className="input-box" />
        {/* Add other elements as needed (e.g., submit button) */}
      </div>
    </div>
  );
};

export default ForgotPasswordPopup;
