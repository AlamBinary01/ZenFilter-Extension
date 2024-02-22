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
  
  // Ensure you call this function appropriately like you do for fetchBlockedUrlsAndStore
  
  
  // Listen for when the extension is installed or the browser starts up
  chrome.runtime.onInstalled.addListener(() => {
    fetchBlockedUrlsAndStore();
    fetchCustomPreferencesAndStore();
  });
  
  chrome.runtime.onStartup.addListener(() => {
    fetchBlockedUrlsAndStore();
    fetchCustomPreferencesAndStore();
  });
  
  // Periodically refresh the list of blocked URLs
  setInterval(fetchBlockedUrlsAndStore, 0.5 * 60 * 1000); // Every 30 minutes
  setInterval(fetchCustomPreferencesAndStore, 0.5 * 60 * 1000);

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

  
  