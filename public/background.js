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
  
  
  // Listen for when the extension is installed or the browser starts up
  chrome.runtime.onInstalled.addListener(() => {
    fetchBlockedUrlsAndStore();
  });
  
  chrome.runtime.onStartup.addListener(() => {
    fetchBlockedUrlsAndStore();
  });
  
  // Periodically refresh the list of blocked URLs
  setInterval(fetchBlockedUrlsAndStore, 0.5 * 60 * 1000); // Every 30 minutes
  
  // Listen for tab updates to block navigation to URLs in the blocked list
  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url) {
      chrome.storage.local.get("blockedUrls", (result) => {
        const blockedUrls = result.blockedUrls || [];
  
        const isBlocked = blockedUrls.some(url => tab.url.includes(url));
  
        if (isBlocked) {
          // Example action: Redirect to a custom blocked page within the extension
          chrome.tabs.update(tabId, {url: "./dashboard.html"});
        }
      });
    }
  });
  