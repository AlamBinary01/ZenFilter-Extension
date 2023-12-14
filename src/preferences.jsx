// Preferences.jsx

import './css/preferences.css'
import React, { useState } from 'react';

const Preferences = () => {
  const [eduPreferences, setEduPreferences] = useState(false);
  const [blockWebsites, setBlockWebsites] = useState(false);
  const [defaultPreferences, setDefaultPreferences] = useState(false);
  const [customPreferences, setCustomPreferences] = useState('');
  const [customList, setCustomList] = useState([]);

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
  <button className="custom-preference-button" >
    +
  </button>

</div>
    </div>
    </div>
  );
};

export default Preferences;
