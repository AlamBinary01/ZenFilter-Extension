// Function to fetch blocked URLs from the backend and store them locally
function fetchBlockedUrlsAndStore() {
    chrome.storage.local.get(["token"], function(result) {
      const token = result.token;
      if (!token) {
        console.log("No token found in storage.");
        return;
      }
  
      // Use the token to fetch blocked URLs
      fetch("http://localhost:5000/getBlockedUrls", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      })
      .then(res => res.json())
      .then(data => {
        if (data.status === "ok" && data.blockedUrls) {
          chrome.storage.local.set({ "blockedUrls": data.blockedUrls });
        }
      })
      .catch(error => console.error('Error fetching blocked URLs:', error));
    });
  }
  
  function fetchCustomPreferencesAndStore() {
    chrome.storage.local.get(["token"], function(result) {
      const token = result.token;
      if (!token) {
        console.log("No token found in storage.");
        return;
      }
  
      fetch("http://localhost:5000/getCustomPreferences", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      })
      .then(res => res.json())
      .then(data => {
        if (data.status === "ok" && data.customPreferences) {
          chrome.storage.local.set({ "customPreferences": data.customPreferences });
        }
      })
      .catch(error => console.error('Error fetching custom preferences:', error));
    });
  }
  
  function fetchBrowserHistory() {
    const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000); // Calculate timestamp for one week ago
    chrome.history.search({ text: '', startTime: oneWeekAgo, maxResults: 1000 }, function(data) {
        const siteVisitCount = {};

        data.forEach(page => {
            try {
                const urlObj = new URL(page.url); // This might throw an error if the URL is invalid
                const hostname = urlObj.hostname; // Use hostname for grouping visits by domain

                if (siteVisitCount[hostname]) {
                    siteVisitCount[hostname]++;
                } else {
                    siteVisitCount[hostname] = 1;
                }
            } catch (error) {
                // If an error occurs, log it and skip this URL
                console.error('Error processing URL:', page.url, error);
            }
        });

        const sortedSites = Object.keys(siteVisitCount).sort((a, b) => siteVisitCount[b] - siteVisitCount[a]).slice(0, 7);
        const topSites = sortedSites.map(site => ({ url: site, visits: siteVisitCount[site] }));

        chrome.storage.local.set({ "topSites": topSites });
    });
}


  

  // Ensure you call this function appropriately like you do for fetchBlockedUrlsAndStore
  
  
  // Listen for when the extension is installed or the browser starts up
  chrome.runtime.onInstalled.addListener(() => {
    fetchBlockedUrlsAndStore();
    fetchCustomPreferencesAndStore();
    fetchBrowserHistory();
  });
  
  chrome.runtime.onStartup.addListener(() => {
    fetchBlockedUrlsAndStore();
    fetchCustomPreferencesAndStore();
    fetchBrowserHistory();
  });
  
  // Periodically refresh the list of blocked URLs
  setInterval(fetchBlockedUrlsAndStore, 0.5 * 60 * 1000); // Every 30 minutes
  setInterval(fetchCustomPreferencesAndStore, 0.5 * 60 * 1000);
  setInterval(fetchBrowserHistory, 1 * 60 * 1000); // Every hour


  // Listen for tab updates to block navigation to URLs in the blocked list
  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url) {
      chrome.storage.local.get(["blockedUrls", "customPreferences"], (result) => {
        const { blockedUrls = [], customPreferences = [] } = result;
  
        const isBlockedUrl = blockedUrls.some(url => tab.url.includes(url));
        const containsCustomPreference = customPreferences.some(preference => tab.url.includes(preference));
  
        if (isBlockedUrl || containsCustomPreference) {
          // For demonstration, redirecting to a dashboard page
          chrome.tabs.update(tabId, {url: "./dashboard.html"});
        }
      });
    }
  });

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "redirect" && sender.tab) {
      chrome.tabs.update(sender.tab.id, {url: request.url});
    }
  });
  
  
  