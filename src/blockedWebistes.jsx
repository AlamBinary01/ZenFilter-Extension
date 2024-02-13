// BlockWebsitesPage.jsx
import React, { useState, useEffect } from 'react';

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

  useEffect(() => {
    const fetchBlockedUrls = () => {
      const email = window.localStorage.getItem("userEmail");
      const token = window.localStorage.getItem("token");
      
      fetch("http://localhost:5000/getBlockedUrls", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email }),
      })
      .then(response => response.json())
      .then(data => {
        if (data.status === 'ok') {
          setBlockedUrls(data.blockedUrls);
        } else {
          // Handle error (user not found, server error, etc.)
          console.error('Failed to fetch blocked URLs:', data.error);
        }
      })
      .catch(error => {
        console.error('Error fetching blocked URLs:', error);
      });
    };

    fetchBlockedUrls();
  }, []);

  const handleAddUrl = () => {
    if (enteredUrl.trim() !== '' && isValidUrl(enteredUrl)) {
      const email = window.localStorage.getItem("userEmail");
      const token = window.localStorage.getItem("token"); // Assuming token is stored in localStorage
  
      // Use fetch to send the URL to your backend
      fetch("http://localhost:5000/addBlockedUrl", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include the token in your request
        },
        body: JSON.stringify({
          email,
          url: enteredUrl,
        }),
      })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        // Successfully added URL to backend, now update UI
        setBlockedUrls((prevUrls) => [...prevUrls, enteredUrl]);
        setEnteredUrl('');
      })
      .catch(error => {
        console.error('Error:', error);
        setUrlFormatError('Could not save URL. Please try again.');
      });
    } else {
      setUrlFormatError('Invalid URL format. Please enter a valid URL.');
    }
  };
  

  const handleDeleteUrl = (urlToDelete) => {
    const email = window.localStorage.getItem("userEmail");
    const token = window.localStorage.getItem("token");

    fetch("http://localhost:5000/deleteBlockedUrl", { // Assuming you have a /deleteBlockedUrl endpoint
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        email,
        url: urlToDelete,
      }),
    })
    .then(response => response.json())
    .then(data => {
      if (data.status === 'ok') {
        // Remove URL from frontend state
        setBlockedUrls((prevUrls) => prevUrls.filter((url) => url !== urlToDelete));
      } else {
        // Handle error
        console.error('Failed to delete URL:', data.error);
      }
    })
    .catch(error => {
      console.error('Error deleting URL:', error);
    });
  
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
            <button onClick={() => handleDeleteUrl(url)} style={deleteButtonStyle}>
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
  borderBottom: '2px solid #000000',
  padding: '8px',
  color : '#F79817',
  fontWeight: 'bold',
  borderRadius : '15px'
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
  border: '1px solid #F79817',
};

const buttonStyle = {
  padding: '8px 12px',
  borderRadius: '4px',
  background: '#e67315',
  color: '#fff',
  cursor: 'zoom-in',
  border: '4px solid #f79817',
  minWidth: '80px',
};

const emptyBoxStyle = {
  border: '4px solid #f79817',
  borderRadius: '15px',
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
