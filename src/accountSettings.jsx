import React, { useState } from 'react';
import './setting.css';

const AccountSettings = ({ onBack }) => {
    const [isEmailModalOpen, setEmailModalOpen] = useState(false);
    const [isPasswordModalOpen, setPasswordModalOpen] = useState(false);
    const [emailForm, setEmailForm] = useState({ currentEmail: '', newEmail: '' });
    const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '' });
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const handleEmailChange = (e) => {
        setEmailForm({ ...emailForm, [e.target.name]: e.target.value });
        setEmailError(''); // Clear error when user starts typing again
    };

    const handlePasswordChange = (e) => {
        setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
        setPasswordError(''); // Clear error when user starts typing again
    };

    const submitEmailChange = () => {
        const token = window.localStorage.getItem("token");
        fetch("http://localhost:5000/updateEmail", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                token,
                currentEmail: emailForm.currentEmail,
                newEmail: emailForm.newEmail,
            }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === "ok") {
                setEmailModalOpen(false);
            } else {
                setEmailError(data.error);
            }
        })
        .catch(error => {
            setEmailError("Failed to update email.");
        });
    };

    const submitPasswordChange = () => {
        const token = window.localStorage.getItem("token");
        fetch("http://localhost:5000/updatePassword", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                token,
                currentPassword: passwordForm.currentPassword,
                newPassword: passwordForm.newPassword,
            }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === "ok") {
                setPasswordModalOpen(false);
            } else {
                setPasswordError(data.error);
            }
        })
        .catch(error => {
            setPasswordError("Failed to update password.");
        });
    };

    return (
        <div style={centerStyle}>
            <div className="backArrow" onClick={onBack}>&larr; Back</div>
            <h2 style={titleStyle}>Account Settings</h2>
            <div style={buttonContainerStyle}>
                <button className="buttonStyle" onClick={() => setEmailModalOpen(true)}>Change Email</button>
                <button className="buttonStyle" onClick={() => setPasswordModalOpen(true)}>Change Password</button>
            </div>

            {/* Email Modal */}
            {isEmailModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <input type="text" name="currentEmail" placeholder="Existing Email" value={emailForm.currentEmail} onChange={handleEmailChange} />
                        <input type="text" name="newEmail" placeholder="New Email" value={emailForm.newEmail} onChange={handleEmailChange} />
                        {emailError && <p className="error">{emailError}</p>}
                        <button onClick={submitEmailChange}>Confirm</button>
                        <button onClick={() => setEmailModalOpen(false)}>Close</button>
                    </div>
                </div>
            )}

            {/* Password Modal */}
            {isPasswordModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <input type="password" name="currentPassword" placeholder="Current Password" value={passwordForm.currentPassword} onChange={handlePasswordChange} />
                        <input type="password" name="newPassword" placeholder="New Password" value={passwordForm.newPassword} onChange={handlePasswordChange} />
                        {passwordError && <p className="error">{passwordError}</p>}
                        <button onClick={submitPasswordChange}>Confirm</button>
                        <button onClick={() => setPasswordModalOpen(false)}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

const centerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: '20px',
    paddingTop: '100px',
    height: '100vh',
    paddingLeft: '500px',
};

const titleStyle = {
    fontWeight: 'bold',
    border: '3px solid #000000',
    padding: '10px',
    marginBottom: '20px',
    borderRadius: '0 0 10px 10px'
};

const buttonContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
};

export default AccountSettings;
