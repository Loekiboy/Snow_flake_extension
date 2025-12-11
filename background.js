// Background service worker
chrome.runtime.onInstalled.addListener(function(details) {
  if (details.reason === 'install') {
    // Set default settings on first install
    const defaultSettings = {
      enabled: true,
      speed: 1,
      count: 50,
      appearance: 'snowflake',
      customImage: '',
      disabledSites: []
    };
    
    chrome.storage.sync.set({snowSettings: defaultSettings});
  }
});

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  // Handle any background processing if needed
  sendResponse({success: true});
});
