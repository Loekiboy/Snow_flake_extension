// Background service worker
// Version 2.1 - With all advanced settings
chrome.runtime.onInstalled.addListener(function(details) {
  if (details.reason === 'install') {
    // Set default settings on first install (matching advanced.js)
    const defaultSettings = {
      enabled: true,
      speed: 1,
      count: 50,
      maxSize: 30,
      minSize: 8,
      sizeVariation: 50,
      appearance: 'snowflake',
      disabledSites: [],
      behindContent: false,
      wind: 1,
      turbulence: 0.5,
      rotation: 1,
      sway: 1,
      opacity: 80,
      blur: 0,
      glow: 50,
      customImage: '',
      color: '#ffffff',
      rainbowMode: false,
      sparkleEffect: false,
      trailEffect: false,
      pauseOnScroll: false,
      collectAtBottom: false,
      fps: 60,
      gpuAcceleration: true,
      reduceOnBattery: false,
      pauseWhenHidden: true
    };
    
    chrome.storage.local.set({snowSettings: defaultSettings});
  }
});

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  sendResponse({success: true});
});
