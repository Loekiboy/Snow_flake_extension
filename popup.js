// Popup script for settings management
document.addEventListener('DOMContentLoaded', function() {
  const enableSnow = document.getElementById('enableSnow');
  const speedSlider = document.getElementById('speed');
  const speedValue = document.getElementById('speedValue');
  const countSlider = document.getElementById('count');
  const countValue = document.getElementById('countValue');
  const sizeSlider = document.getElementById('size');
  const sizeValue = document.getElementById('sizeValue');
  const windSlider = document.getElementById('wind');
  const windValue = document.getElementById('windValue');
  const appearanceRadios = document.querySelectorAll('input[name="appearance"]');
  const customImageGroup = document.getElementById('customImageGroup');
  const customImageInput = document.getElementById('customImage');
  const customImageFile = document.getElementById('customImageFile');
  const disableSiteBtn = document.getElementById('disableSite');
  const saveSettingsBtn = document.getElementById('saveSettings');
  const messageDiv = document.getElementById('message');
  const disabledSitesGroup = document.getElementById('disabledSitesGroup');
  const disabledSitesList = document.getElementById('disabledSitesList');

  let currentSettings = {
    enabled: true,
    speed: 1,
    count: 50,
    maxSize: 30,
    wind: 1,
    appearance: 'snowflake',
    customImage: '',
    disabledSites: []
  };

  // Load settings
  chrome.storage.sync.get(['snowSettings'], function(result) {
    if (result.snowSettings) {
      // Merge with defaults to handle new settings
      currentSettings = {...currentSettings, ...result.snowSettings};
      updateUI();
      updateDisabledSitesList();
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
    
    if (windSlider) {
      windSlider.value = currentSettings.wind !== undefined ? currentSettings.wind : 1;
      windValue.textContent = (currentSettings.wind !== undefined ? currentSettings.wind : 1).toFixed(1);
    }
    
    appearanceRadios.forEach(radio => {
      if (radio.value === currentSettings.appearance) {
        radio.checked = true;
      }
    });
    
    if (currentSettings.customImage) {
      customImageInput.value = currentSettings.customImage;
    }
    
    updateCustomImageVisibility();
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

  // Show/hide custom image input
  function updateCustomImageVisibility() {
    const selectedAppearance = document.querySelector('input[name="appearance"]:checked').value;
    customImageGroup.style.display = selectedAppearance === 'custom' ? 'block' : 'none';
  }

  // Handle file upload
  if (customImageFile) {
    customImageFile.addEventListener('change', function(e) {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
          customImageInput.value = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // Speed slider update
  speedSlider.addEventListener('input', function() {
    speedValue.textContent = parseFloat(this.value).toFixed(1);
  });

  // Count slider update
  countSlider.addEventListener('input', function() {
    countValue.textContent = this.value;
  });

  // Size slider update
  if (sizeSlider) {
    sizeSlider.addEventListener('input', function() {
      sizeValue.textContent = this.value + 'px';
    });
  }

  // Wind slider update
  if (windSlider) {
    windSlider.addEventListener('input', function() {
      windValue.textContent = parseFloat(this.value).toFixed(1);
    });
  }

  // Appearance change
  appearanceRadios.forEach(radio => {
    radio.addEventListener('change', updateCustomImageVisibility);
  });

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
  disableSiteBtn.addEventListener('click', function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      if (tabs[0]) {
        const url = new URL(tabs[0].url);
        const domain = url.hostname;
        
        if (!currentSettings.disabledSites.includes(domain)) {
          currentSettings.disabledSites.push(domain);
          saveSettings(true);
          updateDisabledSitesList();
          
          // Send message to content script
          chrome.tabs.sendMessage(tabs[0].id, {
            action: 'disableSite'
          });
          
          showMessage(`Snow disabled on ${domain}`, 'success');
        } else {
          showMessage('This site is already disabled', 'error');
        }
      }
    });
  });

  // Save settings button
  saveSettingsBtn.addEventListener('click', function() {
    currentSettings.speed = parseFloat(speedSlider.value);
    currentSettings.count = parseInt(countSlider.value);
    if (sizeSlider) currentSettings.maxSize = parseInt(sizeSlider.value);
    if (windSlider) currentSettings.wind = parseFloat(windSlider.value);
    currentSettings.appearance = document.querySelector('input[name="appearance"]:checked').value;
    currentSettings.customImage = customImageInput.value;
    
    // Validate custom image URL if selected
    if (currentSettings.appearance === 'custom' && !currentSettings.customImage) {
      showMessage('Please enter an image URL or upload an image', 'error');
      return;
    }
    
    saveSettings(true);
    
    // Send message to content script to update
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: 'updateSettings',
          settings: currentSettings
        });
      }
    });
  });

  // Save settings to storage
  function saveSettings(showMsg) {
    chrome.storage.sync.set({snowSettings: currentSettings}, function() {
      if (showMsg) {
        showMessage('Settings saved!', 'success');
      }
    });
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
