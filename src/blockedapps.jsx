// BlockedAppsPage.jsx
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { app: 'Web 1', usageTime: 120 },
  { app: 'Web 2', usageTime: 200 },
  { app: 'Web 3', usageTime: 60 },
  { app: 'Web 4', usageTime: 90 },
  { app: 'Web 5', usageTime: 140 },
  { app: 'Web 6', usageTime: 170 },
  { app: 'Web 7', usageTime: 20 },
  { app: 'Web 8', usageTime: 45 },
  // Add more data as needed
];

const blockedWebsitesData = [
  { url: 'http://example.com', reason: 'Inappropriate content' },
  { url: 'http://dummy-site.com', reason: 'Inappropriate content' },
  { url: 'http://blocked-site.com', reason: 'Inappropriate content' },
  // Add more data as needed
];

const BlockedAppsPage = () => {
  return (
    <div style={containerStyle}>
      <h2 style={sectionTitleStyle}>Most used websites</h2>
      <ResponsiveContainer width="150%" height={300}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <XAxis dataKey="app" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="usageTime" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>

      <h2 style={sectionTitleStyle}>Blocked Websites</h2>
      <table style={{ ...tableStyle, borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th style={tableHeaderStyle}>URLs</th>
            <th style={tableHeaderStyle}>Reason of Blocking</th>
          </tr>
        </thead>
        <tbody>
          {blockedWebsitesData.map((website, index) => (
            <tr key={index} style={tableRowStyle}>
              <td style={{ ...tableCellStyle, borderRight: '1px solid #ddd' }}>{website.url}</td>
              <td style={tableCellStyle}>{website.reason}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  paddingLeft: '400px', // Adjust this value based on the width of your sidebar
  margin: 'auto', // Center horizontally
  padding: '-8px'
};

const sectionTitleStyle = {
  color: '#fff',
  border: '4px solid #f79817',
  padding: '8px',
  width: '150%', // Remove or adjust this line
};

const tableStyle = {
  border: '1px solid #ddd',
  borderRadius: '8px', // Optional: Add rounded corners to the table
  // width:'250%' // Remove this line
  minWidth: '250px', // Adjust this value as needed
};

const tableHeaderStyle = {
  borderBottom: '1px solid #ddd',
  padding: '8px',
  // width:'250%' // Remove this line
  minWidth: '250px', // Adjust this value as needed
};

const tableRowStyle = {
  color:'#fff',
  borderBottom: '1px solid #ddd',
  // width:'250%' // Remove this line
  minWidth: '250px', // Adjust this value as needed
};

const tableCellStyle = {
  padding: '8px',
  // width:'250%' // Remove this line
  minWidth: '250px', // Adjust this value as needed
};

export default BlockedAppsPage;
