// Advanced Settings Page Script
document.addEventListener('DOMContentLoaded', function() {
  // Elements - Core
  const enableSnow = document.getElementById('enableSnow');
  const behindContent = document.getElementById('behindContent');
  const collectAtBottom = document.getElementById('collectAtBottom');
  const accumulateOnElements = document.getElementById('accumulateOnElements');
  
  // Elements - Motion
  const speedSlider = document.getElementById('speed');
  const speedValue = document.getElementById('speedValue');
  const windSlider = document.getElementById('wind');
  const windValue = document.getElementById('windValue');
  const turbulenceSlider = document.getElementById('turbulence');
  const turbulenceValue = document.getElementById('turbulenceValue');
  const rotationSlider = document.getElementById('rotation');
  const rotationValue = document.getElementById('rotationValue');
  const swaySlider = document.getElementById('sway');
  const swayValue = document.getElementById('swayValue');
  const mouseWind = document.getElementById('mouseWind');
  
  // Elements - Density & Size
  const countSlider = document.getElementById('count');
  const countValue = document.getElementById('countValue');
  const minSizeSlider = document.getElementById('minSize');
  const minSizeValue = document.getElementById('minSizeValue');
  const sizeSlider = document.getElementById('size');
  const maxSizeValue = document.getElementById('maxSizeValue');
  const sizeVariationSlider = document.getElementById('sizeVariation');
  const sizeVariationValue = document.getElementById('sizeVariationValue');
  const statCount = document.getElementById('statCount');
  const statFPS = document.getElementById('statFPS');
  
  // Elements - Appearance
  const appearanceOptions = document.querySelectorAll('.appearance-option');
  const opacitySlider = document.getElementById('opacity');
  const opacityValue = document.getElementById('opacityValue');
  const blurSlider = document.getElementById('blur');
  const blurValue = document.getElementById('blurValue');
  const glowSlider = document.getElementById('glow');
  const glowValue = document.getElementById('glowValue');
  
  // Elements - Custom Image
  const customImageFile = document.getElementById('customImageFile');
  const customImageInput = document.getElementById('customImage');
  const customImagePreview = document.getElementById('customImagePreview');
  const clearCustomImage = document.getElementById('clearCustomImage');
  
  // Elements - Color
  const colorOptions = document.querySelectorAll('.color-option');
  const colorPickerRow = document.getElementById('colorPickerRow');
  const colorDisabledHint = document.getElementById('colorDisabledHint');
  const rainbowMode = document.getElementById('rainbowMode');
  const sparkleEffect = document.getElementById('sparkleEffect');
  const trailEffect = document.getElementById('trailEffect');
  
  // Elements - Presets
  const presetButtons = document.querySelectorAll('.preset-btn');
  
  // Elements - Blocked Sites
  const disabledSitesList = document.getElementById('disabledSitesList');
  const addSiteInput = document.getElementById('addSiteInput');
  const addSiteBtn = document.getElementById('addSiteBtn');
  const clearAllSites = document.getElementById('clearAllSites');
  
  // Elements - Performance
  const fpsSlider = document.getElementById('fps');
  const fpsValue = document.getElementById('fpsValue');
  const gpuAcceleration = document.getElementById('gpuAcceleration');
  const reduceOnBattery = document.getElementById('reduceOnBattery');
  const pauseWhenHidden = document.getElementById('pauseWhenHidden');
  
  // Elements - Actions
  const saveSettingsBtn = document.getElementById('saveSettings');
  const resetSettingsBtn = document.getElementById('resetSettings');
  const exportSettingsBtn = document.getElementById('exportSettings');
  const importSettingsBtn = document.getElementById('importSettings');
  const messageDiv = document.getElementById('message');

  // Default settings with all new options
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
    // Beta / Advanced settings
    wind: 1,
    turbulence: 0.5,
    rotation: 1,
    sway: 1,
    mouseWind: false,
    opacity: 80,
    blur: 0,
    glow: 50,
    customImage: '',
    color: '#ffffff',
    rainbowMode: false,
    sparkleEffect: false,
    trailEffect: false,
    collectAtBottom: false,
    accumulateOnElements: false,
    fps: 60,
    gpuAcceleration: true,
    reduceOnBattery: false,
    pauseWhenHidden: true
  };

  let currentSettings = {...defaultSettings};

  // Load settings
  chrome.storage.local.get(['snowSettings'], function(result) {
    if (result.snowSettings) {
      currentSettings = {...defaultSettings, ...result.snowSettings};
    }
    updateUI();
    updateDisabledSitesList();
  });

  // Update UI with current settings
  function updateUI() {
    // Core
    enableSnow.checked = currentSettings.enabled;
    behindContent.checked = currentSettings.behindContent;
    collectAtBottom.checked = currentSettings.collectAtBottom;
    accumulateOnElements.checked = currentSettings.accumulateOnElements;
    
    // Motion
    speedSlider.value = currentSettings.speed;
    speedValue.textContent = currentSettings.speed.toFixed(1);
    windSlider.value = currentSettings.wind;
    windValue.textContent = currentSettings.wind.toFixed(1);
    turbulenceSlider.value = currentSettings.turbulence;
    turbulenceValue.textContent = currentSettings.turbulence.toFixed(1);
    rotationSlider.value = currentSettings.rotation;
    rotationValue.textContent = currentSettings.rotation.toFixed(1);
    swaySlider.value = currentSettings.sway;
    swayValue.textContent = currentSettings.sway.toFixed(1);
    mouseWind.checked = currentSettings.mouseWind;
    
    // Density & Size
    countSlider.value = currentSettings.count;
    countValue.textContent = currentSettings.count;
    statCount.textContent = currentSettings.count;
    minSizeSlider.value = currentSettings.minSize;
    minSizeValue.textContent = currentSettings.minSize + 'px';
    sizeSlider.value = currentSettings.maxSize;
    maxSizeValue.textContent = currentSettings.maxSize + 'px';
    sizeVariationSlider.value = currentSettings.sizeVariation;
    sizeVariationValue.textContent = currentSettings.sizeVariation + '%';
    
    // Appearance
    appearanceOptions.forEach(opt => {
      opt.classList.toggle('active', opt.dataset.appearance === currentSettings.appearance);
    });
    opacitySlider.value = currentSettings.opacity;
    opacityValue.textContent = currentSettings.opacity + '%';
    blurSlider.value = currentSettings.blur;
    blurValue.textContent = currentSettings.blur + 'px';
    glowSlider.value = currentSettings.glow;
    glowValue.textContent = currentSettings.glow + '%';
    
    // Custom Image Preview
    if (currentSettings.customImage) {
      customImagePreview.innerHTML = `<img src="${currentSettings.customImage}" alt="Custom">`;
    }
    
    // Color
    colorOptions.forEach(opt => {
      opt.classList.toggle('active', opt.dataset.color === currentSettings.color);
    });
    rainbowMode.checked = currentSettings.rainbowMode;
    sparkleEffect.checked = currentSettings.sparkleEffect;
    trailEffect.checked = currentSettings.trailEffect;
    
    // Update color picker visibility based on current appearance
    updateColorPickerState();
    
    // Performance
    fpsSlider.value = currentSettings.fps;
    fpsValue.textContent = currentSettings.fps;
    statFPS.textContent = currentSettings.fps;
    gpuAcceleration.checked = currentSettings.gpuAcceleration;
    reduceOnBattery.checked = currentSettings.reduceOnBattery;
    pauseWhenHidden.checked = currentSettings.pauseWhenHidden;
  }
  
  // Helper: Check if shape uses SVG (leaf, heart, star) - these can only use rainbow, not custom colors
  function isSvgShape(shape) {
    return shape === 'leaf' || shape === 'heart' || shape === 'star';
  }

  // Helper: Update color picker visibility based on shape
  function updateColorPickerState() {
    const shape = currentSettings.appearance;
    const isSvg = isSvgShape(shape);
    
    if (colorPickerRow) {
      // For SVG shapes: hide color picker (only rainbow mode available)
      colorPickerRow.style.opacity = isSvg ? '0.3' : '1';
      colorPickerRow.style.pointerEvents = isSvg ? 'none' : 'auto';
    }
    if (colorDisabledHint) {
      colorDisabledHint.style.display = isSvg ? 'inline' : 'none';
    }
    // Rainbow mode toggle stays enabled for all shapes
    if (rainbowMode) {
      rainbowMode.disabled = false;
      rainbowMode.parentElement.style.opacity = '1';
      rainbowMode.checked = currentSettings.rainbowMode;
    }
  }

  // Update disabled sites list
  function updateDisabledSitesList() {
    if (currentSettings.disabledSites && currentSettings.disabledSites.length > 0) {
      disabledSitesList.innerHTML = '';
      currentSettings.disabledSites.forEach((site, index) => {
        const siteItem = document.createElement('div');
        siteItem.className = 'blocked-site';
        siteItem.innerHTML = `
          <span>${site}</span>
          <button data-index="${index}">Remove</button>
        `;
        siteItem.querySelector('button').addEventListener('click', function() {
          currentSettings.disabledSites.splice(index, 1);
          updateDisabledSitesList();
          showMessage(`${site} removed from blocked list`, 'success');
        });
        disabledSitesList.appendChild(siteItem);
      });
    } else {
      disabledSitesList.innerHTML = `
        <div class="empty-state">
          <div class="icon">✅</div>
          <div>No sites blocked</div>
        </div>
      `;
    }
  }

  // Auto-save function
  function autoSave() {
    // Update custom image URL if entered
    if (customImageInput.value && customImageInput.value.startsWith('http')) {
      currentSettings.customImage = customImageInput.value;
    }
    
    chrome.storage.local.set({snowSettings: currentSettings}, function() {
      // Silent save, no message
      
      // Notify any open tabs
      chrome.tabs.query({}, function(tabs) {
        tabs.forEach(tab => {
          chrome.tabs.sendMessage(tab.id, {
            action: 'updateSettings',
            settings: currentSettings
          }).catch(() => {});
        });
      });
    });
  }

  // Slider event listeners
  const sliders = [
    { el: speedSlider, val: speedValue, key: 'speed', suffix: '', decimals: 1 },
    { el: windSlider, val: windValue, key: 'wind', suffix: '', decimals: 1 },
    { el: turbulenceSlider, val: turbulenceValue, key: 'turbulence', suffix: '', decimals: 1 },
    { el: rotationSlider, val: rotationValue, key: 'rotation', suffix: '', decimals: 1 },
    { el: swaySlider, val: swayValue, key: 'sway', suffix: '', decimals: 1 },
    { el: countSlider, val: countValue, key: 'count', suffix: '', decimals: 0, updateStat: statCount },
    { el: minSizeSlider, val: minSizeValue, key: 'minSize', suffix: 'px', decimals: 0 },
    { el: sizeSlider, val: maxSizeValue, key: 'maxSize', suffix: 'px', decimals: 0 },
    { el: sizeVariationSlider, val: sizeVariationValue, key: 'sizeVariation', suffix: '%', decimals: 0 },
    { el: opacitySlider, val: opacityValue, key: 'opacity', suffix: '%', decimals: 0 },
    { el: blurSlider, val: blurValue, key: 'blur', suffix: 'px', decimals: 1 },
    { el: glowSlider, val: glowValue, key: 'glow', suffix: '%', decimals: 0 },
    { el: fpsSlider, val: fpsValue, key: 'fps', suffix: '', decimals: 0, updateStat: statFPS }
  ];

  sliders.forEach(({ el, val, key, suffix, decimals, updateStat }) => {
    el.addEventListener('input', function() {
      const v = decimals > 0 ? parseFloat(this.value).toFixed(decimals) : this.value;
      val.textContent = v + suffix;
      currentSettings[key] = parseFloat(this.value);
      if (updateStat) updateStat.textContent = this.value;
      autoSave();
    });
  });

  // Toggle switches
  const toggles = [
    { el: enableSnow, key: 'enabled' },
    { el: behindContent, key: 'behindContent' },
    { el: collectAtBottom, key: 'collectAtBottom' },
    { el: accumulateOnElements, key: 'accumulateOnElements' },
    { el: mouseWind, key: 'mouseWind' },
    { el: rainbowMode, key: 'rainbowMode' },
    { el: sparkleEffect, key: 'sparkleEffect' },
    { el: trailEffect, key: 'trailEffect' },
    { el: gpuAcceleration, key: 'gpuAcceleration' },
    { el: reduceOnBattery, key: 'reduceOnBattery' },
    { el: pauseWhenHidden, key: 'pauseWhenHidden' }
  ];

  toggles.forEach(({ el, key }) => {
    el.addEventListener('change', function() {
      currentSettings[key] = this.checked;
      autoSave();
    });
  });

  // Appearance options
  appearanceOptions.forEach(opt => {
    opt.addEventListener('click', function() {
      appearanceOptions.forEach(o => o.classList.remove('active'));
      this.classList.add('active');
      currentSettings.appearance = this.dataset.appearance;
      updateColorPickerState();
      autoSave();
    });
  });

  // Color options
  colorOptions.forEach(opt => {
    opt.addEventListener('click', function() {
      colorOptions.forEach(o => o.classList.remove('active'));
      this.classList.add('active');
      currentSettings.color = this.dataset.color;
      autoSave();
    });
  });

  // Custom image file upload
  customImageFile.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          const maxSize = 48;
          let width = img.width;
          let height = img.height;
          
          if (width > height) {
            if (width > maxSize) {
              height *= maxSize / width;
              width = maxSize;
            }
          } else {
            if (height > maxSize) {
              width *= maxSize / height;
              height = maxSize;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);
          const resizedDataUrl = canvas.toDataURL('image/png');
          
          currentSettings.customImage = resizedDataUrl;
          customImagePreview.innerHTML = `<img src="${resizedDataUrl}" alt="Custom">`;
          showMessage('Image uploaded & resized!', 'success');
          autoSave();
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  });

  // Clear custom image
  clearCustomImage.addEventListener('click', function() {
    currentSettings.customImage = '';
    customImageInput.value = '';
    customImagePreview.innerHTML = '<span class="placeholder">📷</span>';
    showMessage('Custom image cleared', 'success');
    autoSave();
  });

  // Preset definitions - each preset explicitly sets rainbowMode
  const presets = {
    calm: { speed: 0.5, count: 25, maxSize: 20, minSize: 5, wind: 0.3, turbulence: 0.2, rotation: 0.5, sway: 0.5, opacity: 70, glow: 30, appearance: 'snowflake', behindContent: true, rainbowMode: false, sparkleEffect: false, trailEffect: false, color: '#ffffff' },
    classic: { speed: 1, count: 50, maxSize: 30, minSize: 8, wind: 1, turbulence: 0.5, rotation: 1, sway: 1, opacity: 80, glow: 50, appearance: 'snowflake', behindContent: false, rainbowMode: false, sparkleEffect: false, trailEffect: false, color: '#ffffff' },
    storm: { speed: 2.5, count: 150, maxSize: 25, minSize: 5, wind: 3, turbulence: 1.5, rotation: 2, sway: 2, opacity: 90, glow: 70, appearance: 'ball', behindContent: false, rainbowMode: false, sparkleEffect: false, trailEffect: false, color: '#ffffff' },
    romantic: { speed: 0.6, count: 40, maxSize: 25, minSize: 10, wind: 0.5, turbulence: 0.3, rotation: 0.3, sway: 1.5, opacity: 60, glow: 40, appearance: 'heart', sparkleEffect: true, rainbowMode: false, trailEffect: false, color: '#ffcdd2' },
    party: { speed: 1.5, count: 80, maxSize: 35, minSize: 10, wind: 2, turbulence: 1, rotation: 2, sway: 2, opacity: 90, glow: 80, appearance: 'star', rainbowMode: true, sparkleEffect: true, trailEffect: false, color: '#ffffff' },
    autumn: { speed: 0.8, count: 40, maxSize: 40, minSize: 15, wind: 1.5, turbulence: 0.8, rotation: 1.5, sway: 2, opacity: 85, glow: 20, appearance: 'leaf', rainbowMode: false, sparkleEffect: false, trailEffect: false, color: '#fff9c4' },
    night: { speed: 0.3, count: 60, maxSize: 15, minSize: 3, wind: 0.2, turbulence: 0.1, rotation: 0, sway: 0.3, opacity: 90, glow: 100, appearance: 'star', sparkleEffect: true, rainbowMode: false, behindContent: true, trailEffect: false, color: '#ffffff' },
    minimal: { speed: 0.7, count: 15, maxSize: 20, minSize: 8, wind: 0.5, turbulence: 0.3, rotation: 0.5, sway: 0.5, opacity: 50, glow: 20, appearance: 'ball', behindContent: true, rainbowMode: false, sparkleEffect: false, trailEffect: false, color: '#ffffff' }
  };

  // Preset buttons
  presetButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      const presetName = this.dataset.preset;
      const preset = presets[presetName];
      if (preset) {
        currentSettings = {...defaultSettings, ...preset};
        updateUI();
        presetButtons.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        showMessage(`${presetName.charAt(0).toUpperCase() + presetName.slice(1)} preset applied!`, 'success');
        autoSave();
      }
    });
  });

  // Add blocked site
  addSiteBtn.addEventListener('click', function() {
    const site = addSiteInput.value.trim().toLowerCase();
    if (site && !currentSettings.disabledSites.includes(site)) {
      currentSettings.disabledSites.push(site);
      addSiteInput.value = '';
      updateDisabledSitesList();
      showMessage(`${site} added to blocked list`, 'success');
      autoSave();
    }
  });

  addSiteInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') addSiteBtn.click();
  });

  // Clear all blocked sites
  clearAllSites.addEventListener('click', function() {
    if (currentSettings.disabledSites.length > 0) {
      currentSettings.disabledSites = [];
      updateDisabledSitesList();
      showMessage('All blocked sites cleared', 'success');
      autoSave();
    }
  });

  // Save settings button - hidden but kept for compatibility
  if (saveSettingsBtn) {
    saveSettingsBtn.style.display = 'none';
  }

  // Reset settings
  resetSettingsBtn.addEventListener('click', function() {
    if (confirm('Reset all settings to defaults?')) {
      currentSettings = {...defaultSettings};
      updateUI();
      updateDisabledSitesList();
      showMessage('Settings reset to defaults', 'success');
    }
  });

  // Export settings
  exportSettingsBtn.addEventListener('click', function() {
    const dataStr = JSON.stringify(currentSettings, null, 2);
    const blob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'snowflake-settings.json';
    a.click();
    URL.revokeObjectURL(url);
    showMessage('Settings exported!', 'success');
  });

  // Import settings
  importSettingsBtn.addEventListener('click', function() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = function(e) {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
          try {
            const imported = JSON.parse(e.target.result);
            currentSettings = {...defaultSettings, ...imported};
            updateUI();
            updateDisabledSitesList();
            showMessage('Settings imported!', 'success');
          } catch (err) {
            showMessage('Invalid settings file', 'error');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  });

  // Show message
  function showMessage(text, type) {
    messageDiv.textContent = text;
    messageDiv.className = `message show ${type}`;
    setTimeout(() => {
      messageDiv.classList.remove('show');
    }, 3000);
  }
});
