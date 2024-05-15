import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const BlockedAppsPage = () => {
  // State for dynamic data of past 7 days' web history and blocked URLs
  const [webHistoryData, setWebHistoryData] = useState([]);
  const [blockedUrls, setBlockedUrls] = useState([]);

  useEffect(() => {
    // Fetch blocked URLs
    const fetchBlockedUrls = async () => {
      const token = window.localStorage.getItem("token");
      if (token) {
        try {
          const response = await fetch("http://localhost:5000/getBlockedUrls", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
          });
          const data = await response.json();
          if (data.status === 'ok') {
            setBlockedUrls(data.blockedUrls);
          } else {
            console.error('Failed to fetch blocked URLs:', data.error);
          }
        } catch (error) {
          console.error('Error fetching blocked URLs:', error);
        }
      }
    };

    fetchBlockedUrls();
  }, []);

  useEffect(() => {
    // Fetch the topSites data from chrome.storage.local
    const fetchWebHistory = () => {
      chrome.storage.local.get(["topSites"], function(result) {
        if (result.topSites) {
          const transformedData = result.topSites.map(site => ({
            app: site.url.replace('www.', ''),
            visits: site.visits,
          }));
          setWebHistoryData(transformedData);
        }
      });
    };

    fetchWebHistory();
  }, []);

  return (
    <div style={containerStyle}>
      <h2 style={sectionTitleStyle}>Most used websites</h2>
      <ResponsiveContainer width="150%" height={300}>
        <BarChart data={webHistoryData} margin={{ top: 20, right: 30, left: 20, bottom: 55 }}>
          <XAxis dataKey="app" interval={0} tickFormatter={(value) => `${value.substring(0, 10)}`} tick={{ angle: -45, textAnchor: 'end', style: { fontSize: '12px' } }}/>
          <YAxis />
          <Tooltip />
          <Bar dataKey="visits" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>

      <h2 style={sectionTitleStyle}>Blocked Websites</h2>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={tableHeaderStyle}>URL</th>
            <th style={tableHeaderStyle}>Reason of Blocking</th>
          </tr>
        </thead>
        <tbody>
          {blockedUrls.map((url, index) => (
            <tr key={index} style={tableRowStyle}>
              <td style={tableCellStyle}>{url}</td>
              <td style={tableCellStyle}>Inappropriate content</td>
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
  margin: 'auto',
  padding: '20px 0 0 400px',
};

const sectionTitleStyle = {
  color: '#F79817',
  fontWeight: 'bold',
  border: '2px solid #f79817',
  borderRadius: '4px',
  padding: '10px',
  marginBottom: '20px', // Creates space between title and content
};

const tableStyle = {
  border: '1px solid #ddd',
  borderRadius: '8px',
  marginBottom: '20px', // Adds space below the table
  width : '150%'
};

const tableHeaderStyle = {
  borderBottom: '2px solid #ddd',
  backgroundColor: '#f79817', // Adds a background color to header
  color: 'white', // Changes text color to white for contrast
  padding: '10px',
};

const tableRowStyle = {
  backgroundColor: '#f9f9f9', // Light background for rows for better readability
};

const tableCellStyle = {
  padding: '10px',
  borderRight: '1px solid #ddd',
};

export default BlockedAppsPage;
