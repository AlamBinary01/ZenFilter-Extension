import './css/preferences.css';
import React, { useState,useEffect } from 'react';

const Preferences = () => {
  const [eduPreferences, setEduPreferences] = useState(false);
  const [blockWebsites, setBlockWebsites] = useState(false);
  const [defaultPreferences, setDefaultPreferences] = useState(false);
  const [customList, setCustomList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    const fetchCustomPreferences = () => {
      const email = window.localStorage.getItem("userEmail");
      const token = window.localStorage.getItem("token");
      
      fetch("http://localhost:5000/getCustomPreferences", {
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
          setCustomList(data.customPreferences); // Update the state with fetched custom preferences
        } else {
          // Handle error (user not found, server error, etc.)
          console.error('Failed to fetch custom preferences:', data.error);
        }
      })
      .catch(error => {
        console.error('Error fetching custom preferences:', error);
      });
    };

    fetchCustomPreferences();
  }, []);

  const handleAddCustomPreference = () => {
    if (inputValue.trim() !== '') {
      // Assuming you have stored the user's email and token in localStorage
      const email = window.localStorage.getItem("userEmail");
      const token = window.localStorage.getItem("token");
  
      fetch("http://localhost:5000/addCustomPreference", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include the token in your request if your backend requires authentication
        },
        body: JSON.stringify({
          email,
          customPreference: inputValue,
        }),
      })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        if (data.status === "ok") {
          setCustomList([...customList, inputValue]); // Update UI only after successful backend update
          setInputValue(''); // Clear the input after adding
        } else {
          console.error('Failed to add custom preference', data.error);
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
    }
  };

  const handleDeleteCustomPreference = (preferenceToDelete) => {
    const email = window.localStorage.getItem("userEmail");
    const token = window.localStorage.getItem("token");
  
    fetch("http://localhost:5000/deleteCustomPreference", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        email,
        customPreference: preferenceToDelete,
      }),
    })
    .then(response => response.json())
    .then(data => {
      if (data.status === "ok") {
        // Update the UI to reflect the deletion without needing to refetch all preferences
        setCustomList(customList.filter(item => item !== preferenceToDelete));
      } else {
        console.error('Failed to delete custom preference', data.error);
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
  };
  
  return (
    <div className="preferences-container">
      <h2 className='title-main'>Preferences</h2>
      <div className='options'>
        {/* Educational Preferences */}
        <div className="preference-option">
          <label>Educational Preferences</label>
          <input
            type="checkbox"
            checked={eduPreferences}
            onChange={() => setEduPreferences(!eduPreferences)}
          />
        </div>

        {/* Block Websites */}
        <div className="preference-option">
          <label>Block Websites</label>
          <input
            type="checkbox"
            checked={blockWebsites}
            onChange={() => setBlockWebsites(!blockWebsites)}
          />
        </div>

        {/* Default Preferences */}
        <div className="preference-option">
          <label>Default Preferences</label>
          <input
            type="checkbox"
            checked={defaultPreferences}
            onChange={() => setDefaultPreferences(!defaultPreferences)}
          />
        </div>

        {/* Custom Preferences */}
        <div className="preference-option">
          <label>Custom Preferences</label>
          <button className="custom-preference-button" onClick={() => setIsModalOpen(true)}>
            +
          </button>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="modal">
            <div className="modal-content">
              <input
                type="text"
                placeholder="Enter custom preference"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <button onClick={handleAddCustomPreference}>Add</button>
              <button onClick={() => setIsModalOpen(false)}>Close</button>
              <div className="custom-preferences-display-box">
                {customList.map((item, index) => (
                  <div key={index} className="custom-preference-item">
                    {item}
                    <button className="delete-preference-button" onClick={() => handleDeleteCustomPreference(item)}>x</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Preferences;
