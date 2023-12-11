// Preferences.jsx
import React, { useState } from 'react';

const Preferences = () => {
  const [eduPreferences, setEduPreferences] = useState(false);
  const [blockWebsites, setBlockWebsites] = useState(false);
  const [defaultPreferences, setDefaultPreferences] = useState(false);
  const [customPreferences, setCustomPreferences] = useState('');
  const [customList, setCustomList] = useState([]);

  const handleAddCustomPreference = () => {
    if (customPreferences.trim() !== '') {
      setCustomList([...customList, customPreferences]);
      setCustomPreferences('');
    }
  };

  return (
    <div className="preferences-container">
      <h2>Preferences</h2>

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
        <button onClick={handleAddCustomPreference}>Add Custom Preference</button>
        <input
          type="text"
          value={customPreferences}
          onChange={(e) => setCustomPreferences(e.target.value)}
        />
        <ul>
          {customList.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Preferences;
