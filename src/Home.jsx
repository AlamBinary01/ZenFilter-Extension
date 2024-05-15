import React, { useEffect, useState } from 'react';
import { BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, BsFillBellFill } from 'react-icons/bs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import './css/App.css';

function Home({ onShowHistory }) {
  const [data, setData] = useState([]);
  const [blockedWebsitesCount, setBlockedWebsitesCount] = useState(0);
  const [customPreferencesCount, setCustomPreferenceCount] = useState(0);

useEffect(() => {
  // Fetch blocked URLs count
  const fetchCustomPreferencesCount = async () => {
    const token = window.localStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:5000/getCustomPreferences", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (data.status === 'ok') {
        setCustomPreferenceCount(data.count);
      }
    } catch (error) {
      console.error('Failed to fetch blocked URLs count:', error);
    }
  };

  fetchCustomPreferencesCount();
}, []);


useEffect(() => {
  // Fetch blocked URLs count
  const fetchBlockedUrlsCount = async () => {
    const token = window.localStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:5000/getBlockedUrls", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (data.status === 'ok') {
        setBlockedWebsitesCount(data.count);
      }
    } catch (error) {
      console.error('Failed to fetch blocked URLs count:', error);
    }
  };

  fetchBlockedUrlsCount();
}, []);


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
                    <h4>Blocked Websites</h4>
                    <BsFillArchiveFill className='card_icon'/>
                </div>
                <h3>{blockedWebsitesCount}</h3>
            </div>
            <div className='card'>
                <div className='card-inner'>
                    <h4>Blocked Words</h4>
                    <BsFillGrid3X3GapFill className='card_icon'/>
                </div>
                <h3>{customPreferencesCount}</h3>
            </div>
            <div className='card'>
                <div className='card-inner'>
                    <h4>Categories</h4>
                    <BsPeopleFill className='card_icon'/>
                </div>
                <h3>10</h3>
            </div>
            <div className='card'>
                <div className='card-inner'>
                    <h4>History</h4>
                    <BsFillBellFill className='card_icon'/>
                    </div>
                    <button onClick={onShowHistory} className="showHistoryButton">
                      Show History →
                    </button>
            </div>
        </div>

      <div className='charts' style={{ paddingTop: '10px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 55,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" interval={0} tickFormatter={(value) => `${value.substring(0, 10)}`} tick={{ angle: -45, textAnchor: 'end', style: { fontSize: '12px' } }} />

            <YAxis />
            <Tooltip />
            <Bar dataKey="visits" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>

        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 55,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" interval={0} tickFormatter={(value) => `${value.substring(0, 10)}`} tick={{ angle: -45, textAnchor: 'end', style: { fontSize: '12px' } }} />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="visits" stroke="#82ca9d" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </main>
  );
}

export default Home;
