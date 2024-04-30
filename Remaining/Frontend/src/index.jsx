import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
//  import Widget from './reportABug';
import Feedback from './feedback';
import AccountPage from './accountPage';
import report from './reportABug';

ReactDOM.render(
  <React.StrictMode>
    <AccountPage/>
  </React.StrictMode>,
  document.getElementById('root')
);
