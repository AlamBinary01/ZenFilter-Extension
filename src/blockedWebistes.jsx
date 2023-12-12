// BlockWebsitesPage.jsx
import React, { useState } from 'react';

const BlockWebsitesPage = () => {
  const [enteredUrl, setEnteredUrl] = useState('');
  const [blockedUrls, setBlockedUrls] = useState([]);
  const [urlFormatError, setUrlFormatError] = useState('');

  const handleInputChange = (event) => {
    setEnteredUrl(event.target.value);
    // Clear the error message when the user types in the input box
    setUrlFormatError('');
  };

  const isValidUrl = (url) => {
    // Simple URL validation, you can use a more robust validation approach
    const urlPattern = /^https?:\/\/\S+/;
    return urlPattern.test(url);
  };

  const handleAddUrl = () => {
    if (enteredUrl.trim() !== '') {
      if (isValidUrl(enteredUrl)) {
        setBlockedUrls((prevUrls) => [...prevUrls, enteredUrl]);
        setEnteredUrl('');
        setUrlFormatError('');
      } else {
        setUrlFormatError('Invalid URL format. Please enter a valid URL.');
      }
    }
  };

  const handleDeleteUrl = (index) => {
    setBlockedUrls((prevUrls) => prevUrls.filter((url, i) => i !== index));
  };

  return (
    <div style={containerStyle}>
      <h2 style={pageTitleStyle}>Block Websites</h2>
      <div style={inputContainerStyle}>
        <input
          type="text"
          placeholder="Enter URL to block (https://www.example.com)"
          value={enteredUrl}
          onChange={handleInputChange}
          style={inputStyle}
        />
        <button onClick={handleAddUrl} style={buttonStyle}>
          +
        </button>
      </div>
      {urlFormatError && <p style={errorStyle}>{urlFormatError}</p>}
      <div style={emptyBoxStyle}>
        {blockedUrls.map((url, index) => (
          <div key={index} style={blockedUrlStyle}>
            <span>{url}</span>
            <button onClick={() => handleDeleteUrl(index)} style={deleteButtonStyle}>
              X
            </button>
          </div>
        ))}
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
  border: '3px solid #f79817',
  padding: '8px',
  color : '#fff'
};

const inputContainerStyle = {
  display: 'flex',
  minWidth: '250%',
  alignItems: 'center',
  margin: '20px 0',
};

const inputStyle = {
  flex: '1',
  padding: '8px',
  marginRight: '10px',
  borderRadius: '4px',
  border: '1px solid #ddd',
};

const buttonStyle = {
  padding: '8px 12px',
  borderRadius: '4px',
  background: 'black',
  color: '#fff',
  cursor: 'zoom-in',
  border: '4px solid #f79817',
  minWidth: '80px',
};

const emptyBoxStyle = {
  border: '2px solid #f79817',
  borderRadius: '4px',
  width: '200%', // Adjust the width as needed
  minHeight: '400px', // Set a minimum height for the empty box
  margin: '20px 0',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

const blockedUrlStyle = {
  padding: '8px',
  margin: '5px 0',
  display: 'flex',
  alignItems: 'center',
};

const deleteButtonStyle = {
  minWidth:'35px',
  minHeight: '10px',
  marginLeft: '25px',
  padding: '5px',
  borderRadius: '50%',
  background: 'black',
  color: '#fff',
  cursor: 'pointer',
  border: '1px solid #f79817',
};

const errorStyle = {
  color: 'red',
  margin: '5px 0',
  minWidth:'150%'
};

export default BlockWebsitesPage;
