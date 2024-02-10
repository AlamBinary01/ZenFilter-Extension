import './css/preferences.css';
import React, { useState } from 'react';

const Preferences = () => {
  const [eduPreferences, setEduPreferences] = useState(false);
  const [blockWebsites, setBlockWebsites] = useState(false);
  const [defaultPreferences, setDefaultPreferences] = useState(false);
  const [customList, setCustomList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const handleAddCustomPreference = () => {
    if (inputValue.trim() !== '') {
      setCustomList([...customList, inputValue]);
      setInputValue(''); // Clear the input after adding
    }
  };

  const handleDeleteCustomPreference = (indexToDelete) => {
    setCustomList(customList.filter((_, index) => index !== indexToDelete));
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
                    <button className="delete-preference-button" onClick={() => handleDeleteCustomPreference(index)}>x</button>
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
