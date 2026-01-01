// Popup script for settings management
document.addEventListener('DOMContentLoaded', function() {
  const enableSnow = document.getElementById('enableSnow');
  const speedSlider = document.getElementById('speed');
  const speedValue = document.getElementById('speedValue');
  const countSlider = document.getElementById('count');
  const countValue = document.getElementById('countValue');
  const sizeSlider = document.getElementById('size');
  const sizeValue = document.getElementById('sizeValue');
  const appearanceRadios = document.querySelectorAll('input[name="appearance"]');
  const disableSiteBtn = document.getElementById('disableSite');
  const saveSettingsBtn = document.getElementById('saveSettings');
  const messageDiv = document.getElementById('message');
  const disabledSitesGroup = document.getElementById('disabledSitesGroup');
  const disabledSitesList = document.getElementById('disabledSitesList');
  const behindContentToggle = document.getElementById('behindContent');
  const advancedSettingsBtn = document.getElementById('advancedSettings');
  const presetButtons = document.querySelectorAll('[data-preset]');

  // Hardcoded blocked domains - easy to modify list
  const BLOCKED_DOMAINS = [
    'github.com',
    'slack.com',
    'supabase.com',
    'tweakers.net',
    'quizlet.com',
    'marktplaats.nl',
    'makerworld.com',
    'hackaday.io'
  ];

  function isUrlBlocked(url) {
    try {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname;
      
      return BLOCKED_DOMAINS.some(domain => {
        return hostname === domain || hostname.endsWith('.' + domain);
      });
    } catch (e) {
      return false;
    }
  }

  let currentSettings = {
    enabled: true,
    speed: 1,
    count: 50,
    maxSize: 30,
    appearance: 'snowflake',
    disabledSites: [],
    behindContent: false
  };

  // Load settings
  chrome.storage.local.get(['snowSettings'], function(result) {
    if (result.snowSettings) {
      // Merge with defaults to handle new settings
      currentSettings = {...currentSettings, ...result.snowSettings};
      updateUI();
      updateDisabledSitesList();
      
      // Check if current site is blocked and update UI accordingly
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        if (tabs[0] && tabs[0].url && isUrlBlocked(tabs[0].url)) {
          if (behindContentToggle) {
            behindContentToggle.checked = false;
            behindContentToggle.disabled = true;
            
            // Find the container to append message
            const container = behindContentToggle.closest('.setting-group');
            if (container) {
              const msg = document.createElement('div');
              msg.style.color = '#ff6b6b';
              msg.style.fontSize = '11px';
              msg.style.marginTop = '4px';
              msg.textContent = "Doesn't work on this site";
              container.appendChild(msg);
            }
          }
        }
      });
    }
  });

  // Update UI with current settings
  function updateUI() {
    enableSnow.checked = currentSettings.enabled;
    speedSlider.value = currentSettings.speed;
    speedValue.textContent = currentSettings.speed.toFixed(1);
    countSlider.value = currentSettings.count;
    countValue.textContent = currentSettings.count;
    
    if (sizeSlider) {
      sizeSlider.value = currentSettings.maxSize || 30;
      sizeValue.textContent = (currentSettings.maxSize || 30) + 'px';
    }
    
    const appearanceOther = document.getElementById('appearanceOther');
    let matchFound = false;
    
    appearanceRadios.forEach(radio => {
      if (radio.value === currentSettings.appearance) {
        radio.checked = true;
        matchFound = true;
      }
    });
    
    if (appearanceOther) {
      if (!matchFound) {
        appearanceRadios.forEach(r => r.checked = false);
        appearanceOther.style.display = 'block';
      } else {
        appearanceOther.style.display = 'none';
      }
    }
    
    if (behindContentToggle) {
      behindContentToggle.checked = currentSettings.behindContent || false;
    }
  }

  // Helper: apply preset values and persist
  function applyPreset(preset) {
    if (!preset) return;

    if (preset.speed !== undefined) {
      currentSettings.speed = preset.speed;
      if (speedSlider) {
        speedSlider.value = preset.speed;
        speedValue.textContent = preset.speed.toFixed(1);
      }
    }

    if (preset.count !== undefined) {
      currentSettings.count = preset.count;
      if (countSlider) {
        countSlider.value = preset.count;
        countValue.textContent = preset.count;
      }
    }

    if (preset.maxSize !== undefined && sizeSlider) {
      currentSettings.maxSize = preset.maxSize;
      sizeSlider.value = preset.maxSize;
      sizeValue.textContent = preset.maxSize + 'px';
    }

    if (preset.appearance && appearanceRadios.length) {
      currentSettings.appearance = preset.appearance;
      appearanceRadios.forEach(r => { r.checked = r.value === preset.appearance; });
    }

    if (behindContentToggle && typeof preset.behindContent === 'boolean') {
      currentSettings.behindContent = preset.behindContent;
      behindContentToggle.checked = preset.behindContent;
    }
    
    // Always set rainbowMode from preset (default to false if not specified)
    currentSettings.rainbowMode = preset.rainbowMode === true;

    saveSettings(true);

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: 'updateSettings',
          settings: currentSettings
        });
      }
    });
  }

  // Update disabled sites list
  function updateDisabledSitesList() {
    if (currentSettings.disabledSites && currentSettings.disabledSites.length > 0) {
      disabledSitesGroup.style.display = 'block';
      disabledSitesList.innerHTML = '';
      
      currentSettings.disabledSites.forEach((site, index) => {
        const siteItem = document.createElement('div');
        siteItem.style.cssText = 'display: flex; justify-content: space-between; align-items: center; padding: 5px; background: rgba(0,0,0,0.2); margin: 5px 0; border-radius: 5px; font-size: 12px;';
        
        const siteName = document.createElement('span');
        siteName.textContent = site;
        
        const removeBtn = document.createElement('button');
        removeBtn.textContent = '✕';
        removeBtn.style.cssText = 'background: rgba(255,255,255,0.2); border: none; color: white; cursor: pointer; padding: 2px 8px; border-radius: 3px; font-weight: bold;';
        removeBtn.onclick = function() {
          currentSettings.disabledSites.splice(index, 1);
          saveSettings(false);
          updateDisabledSitesList();
          showMessage(`${site} removed from disabled list`, 'success');
        };
        
        siteItem.appendChild(siteName);
        siteItem.appendChild(removeBtn);
        disabledSitesList.appendChild(siteItem);
      });
    } else {
      disabledSitesGroup.style.display = 'none';
    }
  }

  // Save settings to storage
  function saveSettings(showMsg) {
    chrome.storage.local.set({snowSettings: currentSettings}, function() {
      if (showMsg) {
        showMessage('Settings saved!', 'success');
      }
      
      // Always update content script on save
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        if (tabs[0]) {
          chrome.tabs.sendMessage(tabs[0].id, {
            action: 'updateSettings',
            settings: currentSettings
          });
        }
      });
    });
  }

  // Auto-save function
  function autoSave() {
    currentSettings.speed = parseFloat(speedSlider.value);
    currentSettings.count = parseInt(countSlider.value);
    if (sizeSlider) currentSettings.maxSize = parseInt(sizeSlider.value);
    
    const checkedAppearance = document.querySelector('input[name="appearance"]:checked');
    if (checkedAppearance) {
      currentSettings.appearance = checkedAppearance.value;
    }
    
    saveSettings(false);
  }

  // Speed slider update
  speedSlider.addEventListener('input', function() {
    speedValue.textContent = parseFloat(this.value).toFixed(1);
    autoSave();
  });

  // Count slider update
  countSlider.addEventListener('input', function() {
    countValue.textContent = this.value;
    autoSave();
  });

  // Size slider update
  if (sizeSlider) {
    sizeSlider.addEventListener('input', function() {
      sizeValue.textContent = this.value + 'px';
      autoSave();
    });
  }

  // Appearance radio update
  appearanceRadios.forEach(radio => {
    radio.addEventListener('change', function() {
      const appearanceOther = document.getElementById('appearanceOther');
      if (appearanceOther) appearanceOther.style.display = 'none';
      autoSave();
    });
  });

  // Behind content toggle
  if (behindContentToggle) {
    behindContentToggle.addEventListener('change', function() {
      currentSettings.behindContent = this.checked;
      saveSettings(false);
    });
  }

  // Enable/disable snow toggle
  enableSnow.addEventListener('change', function() {
    currentSettings.enabled = this.checked;
    saveSettings(false);
    
    // Send message to content script
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: 'toggleSnow',
          enabled: enableSnow.checked
        });
      }
    });
  });

  // Disable site button
  if (disableSiteBtn) {
    disableSiteBtn.addEventListener('click', function() {
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        const activeTab = tabs && tabs[0];
        if (!activeTab || !activeTab.url) {
          showMessage('No active site found.', 'error');
          return;
        }

        const url = new URL(activeTab.url);
        if (url.protocol === 'chrome-extension:') {
          showMessage('Open the popup on a website to disable it.', 'error');
          return;
        }

        const domain = url.hostname;
        
        if (!currentSettings.disabledSites.includes(domain)) {
          currentSettings.disabledSites.push(domain);
          saveSettings(true);
          updateDisabledSitesList();
          
          // Send message to content script
          chrome.tabs.sendMessage(activeTab.id, {
            action: 'disableSite'
          });
          
          showMessage(`Snow disabled on ${domain}`, 'success');
        } else {
          showMessage('This site is already disabled', 'error');
        }
      });
    });
  }

  // Save settings button - hidden but kept for compatibility if needed, 
  // though we can just remove the listener or make it do nothing extra.
  if (saveSettingsBtn) {
    saveSettingsBtn.style.display = 'none'; // Hide the button
  }

  // Show message
  function showMessage(text, type) {
    messageDiv.textContent = text;
    messageDiv.className = `message show ${type}`;
    
    setTimeout(() => {
      messageDiv.classList.remove('show');
    }, 3000);
  }
});
