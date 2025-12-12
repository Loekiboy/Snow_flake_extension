// Snow flake extension - main content script
(function() {
  'use strict';

  let snowContainer = null;
  let snowflakes = [];
  let animationFrame = null;
  let settings = {
    enabled: true,
    speed: 1,
    count: 50,
    maxSize: 30,
    wind: 1,
    appearance: 'snowflake', // 'snowflake', 'ball', 'custom'
    customImage: null,
    disabledSites: []
  };

  // Check if snow should be enabled on current site
  function isEnabledOnCurrentSite() {
    const currentDomain = window.location.hostname;
    return !settings.disabledSites.includes(currentDomain);
  }

  // Create snowflake container
  function createContainer() {
    if (snowContainer) return;
    
    snowContainer = document.createElement('div');
    snowContainer.id = 'snow-container-extension';
    snowContainer.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 999999;
      overflow: hidden;
    `;
    document.body.appendChild(snowContainer);
  }

  // Create a single snowflake
  function createSnowflake(initial = false) {
    const flake = document.createElement('div');
    flake.className = 'snowflake-item';
    
    // Random properties for variety
    const maxSize = settings.maxSize || 30;
    const minSize = Math.max(5, maxSize / 3);
    const size = Math.random() * (maxSize - minSize) + minSize;
    
    const startX = Math.random() * window.innerWidth;
    const startY = initial ? Math.random() * window.innerHeight : -size;
    const speed = (Math.random() * 1 + 0.5) * settings.speed; // 0.5-1.5 * speed setting
    const rotationSpeed = (Math.random() * 2 - 1) * 0.5; // Very slight rotation
    
    // Synchronized drift pattern using sine wave
    const driftPhase = Math.random() * Math.PI * 2;
    const windStrength = settings.wind !== undefined ? settings.wind : 1;
    const driftAmplitude = (Math.random() * 30 + 20) * windStrength; // 20-50px amplitude * wind
    const driftFrequency = (Math.random() * 0.02 + 0.01) * windStrength; // Drift frequency * wind
    
    const snowflakeData = {
      element: flake,
      x: startX,
      y: startY,
      size: size,
      speed: speed,
      rotation: 0,
      rotationSpeed: rotationSpeed,
      driftPhase: driftPhase,
      driftAmplitude: driftAmplitude,
      driftFrequency: driftFrequency,
      time: 0
    };
    
    // Set appearance based on settings
    if (settings.appearance === 'ball') {
      flake.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: radial-gradient(circle at 30% 30%, #ffffff, #e0e0e0);
        border-radius: 50%;
        opacity: ${0.6 + Math.random() * 0.4};
        box-shadow: 0 0 ${size/2}px rgba(255, 255, 255, 0.5);
      `;
    } else if (settings.appearance === 'custom' && settings.customImage) {
      flake.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background-image: url(${settings.customImage});
        background-size: contain;
        background-repeat: no-repeat;
        opacity: ${0.6 + Math.random() * 0.4};
      `;
    } else {
      // Default snowflake SVG
      const svgUrl = chrome.runtime.getURL('snow_flake.svg');
      flake.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background-image: url(${svgUrl});
        background-size: contain;
        background-repeat: no-repeat;
        opacity: ${0.6 + Math.random() * 0.4};
        filter: drop-shadow(0 0 2px rgba(255, 255, 255, 0.8));
      `;
    }
    
    snowContainer.appendChild(flake);
    return snowflakeData;
  }

  // Update snowflake position
  function updateSnowflake(flake) {
    flake.time += 1;
    flake.y += flake.speed;
    flake.rotation += flake.rotationSpeed;
    
    // Synchronized horizontal drift using sine wave
    const driftOffset = Math.sin(flake.time * flake.driftFrequency + flake.driftPhase) * flake.driftAmplitude;
    const currentX = flake.x + driftOffset;
    
    // Apply transform
    flake.element.style.transform = `translate(${currentX}px, ${flake.y}px) rotate(${flake.rotation}deg)`;
    
    // Reset when off screen
    if (flake.y > window.innerHeight + flake.size) {
      flake.y = -flake.size;
      flake.x = Math.random() * window.innerWidth;
      flake.time = 0;
    }
    
    return true; // Still active
  }

  // Animation loop
  function animate() {
    snowflakes.forEach(updateSnowflake);
    animationFrame = requestAnimationFrame(animate);
  }

  // Initialize snow
  function initSnow() {
    if (!settings.enabled || !isEnabledOnCurrentSite()) {
      stopSnow();
      return;
    }
    
    if (snowContainer) {
      stopSnow();
    }
    
    createContainer();
    
    // Create snowflakes
    snowflakes = [];
    for (let i = 0; i < settings.count; i++) {
      snowflakes.push(createSnowflake(true));
    }
    
    // Start animation
    animate();
  }

  // Stop snow
  function stopSnow() {
    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
      animationFrame = null;
    }
    
    if (snowContainer) {
      snowContainer.remove();
      snowContainer = null;
    }
    
    snowflakes = [];
  }

  // Load settings from storage
  function loadSettings() {
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.sync.get(['snowSettings'], function(result) {
        if (result.snowSettings) {
          Object.assign(settings, result.snowSettings);
        }
        initSnow();
      });
    } else {
      initSnow();
    }
  }

  // Listen for settings changes
  if (typeof chrome !== 'undefined' && chrome.storage) {
    chrome.storage.onChanged.addListener(function(changes, namespace) {
      if (changes.snowSettings) {
        Object.assign(settings, changes.snowSettings.newValue);
        initSnow();
      }
    });
  }

  // Listen for messages from popup
  if (typeof chrome !== 'undefined' && chrome.runtime) {
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
      if (request.action === 'toggleSnow') {
        settings.enabled = request.enabled;
        initSnow();
      } else if (request.action === 'updateSettings') {
        Object.assign(settings, request.settings);
        initSnow();
      } else if (request.action === 'disableSite') {
        const currentDomain = window.location.hostname;
        if (!settings.disabledSites.includes(currentDomain)) {
          settings.disabledSites.push(currentDomain);
          // Save updated settings to storage
          if (chrome.storage) {
            chrome.storage.sync.set({snowSettings: settings});
          }
          stopSnow();
        }
      } else if (request.action === 'getCurrentDomain') {
        sendResponse({domain: window.location.hostname});
        return true;
      }
      sendResponse({success: true});
    });
  }

  // Initialize when page loads
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadSettings);
  } else {
    loadSettings();
  }

  // Handle window resize
  window.addEventListener('resize', function() {
    if (settings.enabled && isEnabledOnCurrentSite()) {
      initSnow();
    }
  });
})();
