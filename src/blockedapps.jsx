import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Define the blockedWebsitesData array here if it's static
const blockedWebsitesData = [
  { url: 'http://example.com', reason: 'Inappropriate content' },
  { url: 'http://dummy-site.com', reason: 'Inappropriate content' },
  { url: 'http://blocked-site.com', reason: 'Inappropriate content' },
  // Add more data as needed
];

const BlockedAppsPage = () => {
  // State for dynamic data of past 7 days' web history
  const [webHistoryData, setWebHistoryData] = useState([]);

  useEffect(() => {
    // Fetch the topSites data from chrome.storage.local
    const fetchWebHistory = () => {
      chrome.storage.local.get(["topSites"], function(result) {
        if (result.topSites) {
          // Transform the data to fit the chart
          const transformedData = result.topSites.map(site => ({
            app: site.url.replace('www.', ''), // Assuming you want to display hostname as 'app'
            visits: site.visits // Assuming 'visits' can represent 'visits'
          }));
          setWebHistoryData(transformedData);
        }
      });
    };

    fetchWebHistory();
  }, []);

  // Your existing component structure follows here

  return (
    <div style={containerStyle}>
      <h2 style={sectionTitleStyle}>Most used websites</h2>
      <ResponsiveContainer width="100%" height={300}>
        {/* Use dynamic webHistoryData for the BarChart */}
        <BarChart data={webHistoryData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <XAxis dataKey="app" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="visits" fill="#8884d8" />
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

// Your existing styles remain unchanged

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
  color: '#F79817',
  fontWeight: 'bold',
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
