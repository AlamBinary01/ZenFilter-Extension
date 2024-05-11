import React from 'react';
import { createRoot } from 'react-dom/client'; // Import createRoot
import './index.css';
// import Feedback from './feedback';
import ReportBug from './reportABug';

// Find the div with the ID of 'root' and initialize the root
const container = document.getElementById('root');
const root = createRoot(container); // Create a root.

// Render the Feedback component using the root.render method
root.render(
  <React.StrictMode>
    <ReportBug />
  </React.StrictMode>
);
