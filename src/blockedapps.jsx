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

const BlockedAppsPage = () => {
  return (
    <div>
      <h2>Blocked Apps</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <XAxis dataKey="app" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="usageTime" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BlockedAppsPage;
