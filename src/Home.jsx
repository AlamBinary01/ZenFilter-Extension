import React, { useEffect, useState } from 'react';
import { BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, BsFillBellFill } from 'react-icons/bs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

function Home() {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Function to fetch top sites data from chrome storage
    const fetchTopSites = () => {
      chrome.storage.local.get(["topSites"], function(result) {
        if (result.topSites) {
          const formattedData = result.topSites.map(site => ({
            // Directly use the site.url (hostname) without needing to parse it as a URL
            name: site.url.replace('www.', ''), // Remove 'www.' if present
            visits: site.visits
          }));
          setData(formattedData);
        }
      });
    };

    fetchTopSites();

    // Optionally, set an interval to periodically refresh the data
    const intervalId = setInterval(fetchTopSites, 60 * 60 * 1000); // Refresh every hour

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <main className='main-container'>
      <div className='main-title'>
          <h2>DASHBOARD</h2>
      </div>

      <div className='main-cards'>
            <div className='card'>
                <div className='card-inner'>
                    <h4>Preferences</h4>
                    <BsFillArchiveFill className='card_icon'/>
                </div>
                <h3>300</h3>
            </div>
            <div className='card'>
                <div className='card-inner'>
                    <h4>Block Website</h4>
                    <BsFillGrid3X3GapFill className='card_icon'/>
                </div>
                <h3>12</h3>
            </div>
            <div className='card'>
                <div className='card-inner'>
                    <h4>Block App</h4>
                    <BsPeopleFill className='card_icon'/>
                </div>
                <h3>33</h3>
            </div>
            <div className='card'>
                <div className='card-inner'>
                    <h4>History</h4>
                    <BsFillBellFill className='card_icon'/>
                </div>
                <h3>42</h3>
            </div>
        </div>

      <div className='charts' style={{ paddingTop: '20px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="visits" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>

        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="visits" stroke="#82ca9d" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </main>
  );
}

export default Home;
