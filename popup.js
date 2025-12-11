// Popup script for settings management
document.addEventListener('DOMContentLoaded', function() {
  const enableSnow = document.getElementById('enableSnow');
  const speedSlider = document.getElementById('speed');
  const speedValue = document.getElementById('speedValue');
  const countSlider = document.getElementById('count');
  const countValue = document.getElementById('countValue');
  const appearanceRadios = document.querySelectorAll('input[name="appearance"]');
  const customImageGroup = document.getElementById('customImageGroup');
  const customImageInput = document.getElementById('customImage');
  const disableSiteBtn = document.getElementById('disableSite');
  const saveSettingsBtn = document.getElementById('saveSettings');
  const messageDiv = document.getElementById('message');

  let currentSettings = {
    enabled: true,
    speed: 1,
    count: 50,
    appearance: 'snowflake',
    customImage: '',
    disabledSites: []
  };

  // Load settings
  chrome.storage.sync.get(['snowSettings'], function(result) {
    if (result.snowSettings) {
      currentSettings = result.snowSettings;
      updateUI();
    }
  });

  // Update UI with current settings
  function updateUI() {
    enableSnow.checked = currentSettings.enabled;
    speedSlider.value = currentSettings.speed;
    speedValue.textContent = currentSettings.speed.toFixed(1);
    countSlider.value = currentSettings.count;
    countValue.textContent = currentSettings.count;
    
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

  // Show/hide custom image input
  function updateCustomImageVisibility() {
    const selectedAppearance = document.querySelector('input[name="appearance"]:checked').value;
    customImageGroup.style.display = selectedAppearance === 'custom' ? 'block' : 'none';
  }

  // Speed slider update
  speedSlider.addEventListener('input', function() {
    speedValue.textContent = parseFloat(this.value).toFixed(1);
  });

  // Count slider update
  countSlider.addEventListener('input', function() {
    countValue.textContent = this.value;
  });

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
          
          // Send message to content script
          chrome.tabs.sendMessage(tabs[0].id, {
            action: 'disableSite'
          });
          
          showMessage(`Sneeuw uitgeschakeld op ${domain}`, 'success');
        } else {
          showMessage('Deze site is al uitgeschakeld', 'error');
        }
      }
    });
  });

  // Save settings button
  saveSettingsBtn.addEventListener('click', function() {
    currentSettings.speed = parseFloat(speedSlider.value);
    currentSettings.count = parseInt(countSlider.value);
    currentSettings.appearance = document.querySelector('input[name="appearance"]:checked').value;
    currentSettings.customImage = customImageInput.value;
    
    // Validate custom image URL if selected
    if (currentSettings.appearance === 'custom' && !currentSettings.customImage) {
      showMessage('Voer een afbeelding URL in', 'error');
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
        showMessage('Instellingen opgeslagen!', 'success');
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
