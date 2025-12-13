// Snow flake extension - main content script
// Version 2.1 - Fully compatible with Advanced Settings
(function() {
  'use strict';

  let snowContainer = null;
  let accumulationContainer = null;
  let snowflakes = [];
  let accumulatedSnow = [];
  let animationFrame = null;
  let globalWind = 0;
  let windTarget = 0;
  let windChangeTimer = 0;
  let lastFrameTime = 0;
  let targetFrameTime = 1000 / 60;
  let isPaused = false;
  let isScrolling = false;
  let scrollTimeout = null;
  let mouseX = window.innerWidth / 2;
  
  // Default settings matching advanced.js exactly
  let settings = {
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
    accumulateOnElements: false,
    mouseWind: false,
    fps: 60,
    gpuAcceleration: true,
    reduceOnBattery: false,
    pauseWhenHidden: true
  };

  // Rainbow color palette - used for rainbow mode
  const rainbowColors = ['#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#1dd1a1', '#ff7675', '#74b9ff', '#a29bfe', '#fd79a8', '#00cec9', '#e17055', '#fdcb6e'];

  // Check if snow should be enabled on current site
  function isEnabledOnCurrentSite() {
    const currentDomain = window.location.hostname;
    return !settings.disabledSites.includes(currentDomain);
  }

  // Check if shape uses SVG images (leaf, heart, star) - these can only use rainbow, not custom colors
  function isSvgShape(shape) {
    return shape === 'leaf' || shape === 'heart' || shape === 'star';
  }

  // Get snowflake color based on settings and shape
  function getSnowflakeColor(shape) {
    // Rainbow mode: all shapes get random colors
    if (settings.rainbowMode === true) {
      return rainbowColors[Math.floor(Math.random() * rainbowColors.length)];
    }
    
    // For SVG shapes (leaf/heart/star) without rainbow mode: return null to use original SVG colors
    if (isSvgShape(shape)) {
      return null; // Will use original SVG colors
    }
    
    // For snowflake and ball: use custom color setting
    if (settings.color && settings.color !== '#ffffff' && settings.color !== '') {
      return settings.color;
    }
    return '#ffffff';
  }

  // Get hue rotation for rainbow effect (returns degrees)
  function getRandomHueRotation() {
    return Math.floor(Math.random() * 360);
  }

  // Create snowflake container
  function createContainer() {
    if (snowContainer) return;
    
    const zIndex = settings.behindContent ? '-1' : '999999';
    
    snowContainer = document.createElement('div');
    snowContainer.id = 'snow-container-extension';
    snowContainer.style.cssText = `
      position: fixed;
      inset: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: ${zIndex};
      overflow: hidden;
      ${settings.gpuAcceleration ? 'transform: translateZ(0); will-change: transform;' : ''}
    `;

    if (settings.behindContent) {
      document.body.prepend(snowContainer);
    } else {
      document.body.appendChild(snowContainer);
    }
    
    if (settings.collectAtBottom) {
      createAccumulationContainer(zIndex);
    }
  }

  // Create container for accumulated snow at bottom
  function createAccumulationContainer(zIndex) {
    if (accumulationContainer) return;
    
    accumulationContainer = document.createElement('div');
    accumulationContainer.id = 'snow-accumulation-container';
    accumulationContainer.style.cssText = `
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      height: 80px;
      pointer-events: none;
      z-index: ${zIndex};
      overflow: hidden;
    `;
    
    if (settings.behindContent) {
      document.body.prepend(accumulationContainer);
    } else {
      document.body.appendChild(accumulationContainer);
    }
  }

  // Adjust color brightness (for ball gradient)
  function adjustColor(color, amount) {
    if (!color || color === '#ffffff') return amount < 0 ? '#e0e0e0' : '#ffffff';
    try {
      const hex = color.replace('#', '');
      const r = Math.max(0, Math.min(255, parseInt(hex.substr(0, 2), 16) + amount));
      const g = Math.max(0, Math.min(255, parseInt(hex.substr(2, 2), 16) + amount));
      const b = Math.max(0, Math.min(255, parseInt(hex.substr(4, 2), 16) + amount));
      return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    } catch (e) {
      return color;
    }
  }

  // Create a single snowflake
  function createSnowflake(initial = false) {
    const flake = document.createElement('div');
    flake.className = 'snowflake-item';
    
    // Size range from settings
    const maxSize = settings.maxSize || 30;
    const minSize = settings.minSize || 8;
    const sizeRange = (maxSize - minSize) * (settings.sizeVariation / 100);
    const size = minSize + Math.random() * sizeRange;
    
    const startX = Math.random() * window.innerWidth;
    const startY = initial ? Math.random() * window.innerHeight : -size;
    
    // Speed based on settings
    const baseSpeed = (Math.random() * 0.5 + 0.75) * settings.speed;
    
    // Rotation speed from settings
    const rotationSpeed = (Math.random() * 2 - 1) * 0.5 * settings.rotation;
    
    // Sway (drift) parameters
    const swayFactor = settings.sway || 1;
    const driftPhase = Math.random() * Math.PI * 2;
    const driftAmplitude = (Math.random() * 30 + 20) * swayFactor * settings.turbulence;
    const driftFrequency = (Math.random() * 0.02 + 0.01);
    
    // Opacity from settings (converted from percentage)
    const opacityBase = (settings.opacity || 80) / 100;
    const opacity = opacityBase * (0.7 + Math.random() * 0.3);
    
    // Get the shape for this snowflake
    const shape = settings.appearance;
    
    // Get color for this snowflake - colored shapes always get rainbow colors
    const color = getSnowflakeColor(shape);
    
    // Check initial element for smart accumulation
    let initialElement = null;
    if (settings.accumulateOnElements) {
      try {
        initialElement = document.elementFromPoint(startX, startY);
      } catch (e) {}
    }

    const snowflakeData = {
      element: flake,
      initialElement: initialElement,
      x: startX,
      y: startY,
      size: size,
      speed: baseSpeed,
      rotation: Math.random() * 360,
      rotationSpeed: rotationSpeed,
      driftPhase: driftPhase,
      driftAmplitude: driftAmplitude,
      driftFrequency: driftFrequency,
      time: Math.random() * 1000,
      color: color,
      opacity: opacity,
      sparklePhase: Math.random() * Math.PI * 2,
      shape: shape,
      hueRotation: settings.rainbowMode ? getRandomHueRotation() : 0  // For rainbow effect on SVG shapes
    };
    
    // Build filter string for visual effects
    let filters = [];
    if (settings.blur > 0) {
      filters.push(`blur(${settings.blur}px)`);
    }
    const glowAmount = (settings.glow || 50) / 100;
    
    // GPU acceleration style
    const gpuStyle = settings.gpuAcceleration ? 'will-change: transform;' : '';
    
    // Set appearance based on settings
    if (shape === 'custom' && settings.customImage) {
      if (glowAmount > 0) {
        filters.push(`drop-shadow(0 0 ${glowAmount * 8}px ${color})`);
      }
      const filterString = filters.length > 0 ? filters.join(' ') : '';
      flake.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background-image: url(${settings.customImage});
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        opacity: ${opacity};
        ${filterString ? `filter: ${filterString};` : ''}
        ${gpuStyle}
      `;
    } else if (shape === 'ball') {
      if (glowAmount > 0) {
        filters.push(`drop-shadow(0 0 ${glowAmount * 8}px ${color})`);
      }
      const filterString = filters.length > 0 ? filters.join(' ') : '';
      flake.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: radial-gradient(circle at 30% 30%, ${color}, ${adjustColor(color, -30)});
        border-radius: 50%;
        opacity: ${opacity};
        box-shadow: 0 0 ${size/3}px ${color}50;
        ${filterString ? `filter: ${filterString};` : ''}
        ${gpuStyle}
      `;
    } else if (shape === 'star') {
      // Use actual SVG file from images folder
      const svgUrl = chrome.runtime.getURL('images/Star.svg');
      // For rainbow mode, add hue-rotate filter
      if (settings.rainbowMode) {
        filters.push(`hue-rotate(${snowflakeData.hueRotation}deg)`);
        filters.push(`saturate(1.5)`);
      }
      if (glowAmount > 0) {
        filters.push(`drop-shadow(0 0 ${glowAmount * 6}px #ffff00)`);
      }
      const filterString = filters.length > 0 ? filters.join(' ') : '';
      flake.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background-image: url(${svgUrl});
        background-size: contain;
        background-repeat: no-repeat;
        opacity: ${opacity};
        ${filterString ? `filter: ${filterString};` : ''}
        ${gpuStyle}
      `;
    } else if (shape === 'heart') {
      // Use actual SVG file from images folder
      const svgUrl = chrome.runtime.getURL('images/Heart.svg');
      // For rainbow mode, add hue-rotate filter
      if (settings.rainbowMode) {
        filters.push(`hue-rotate(${snowflakeData.hueRotation}deg)`);
        filters.push(`saturate(1.5)`);
      }
      if (glowAmount > 0) {
        filters.push(`drop-shadow(0 0 ${glowAmount * 6}px #ff0000)`);
      }
      const filterString = filters.length > 0 ? filters.join(' ') : '';
      flake.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background-image: url(${svgUrl});
        background-size: contain;
        background-repeat: no-repeat;
        opacity: ${opacity};
        ${filterString ? `filter: ${filterString};` : ''}
        ${gpuStyle}
      `;
    } else if (shape === 'leaf') {
      // Use actual SVG file from images folder
      const svgUrl = chrome.runtime.getURL('images/Leaf.svg');
      // For rainbow mode, add hue-rotate filter
      if (settings.rainbowMode) {
        filters.push(`hue-rotate(${snowflakeData.hueRotation}deg)`);
        filters.push(`saturate(1.5)`);
      }
      if (glowAmount > 0) {
        filters.push(`drop-shadow(0 0 ${glowAmount * 6}px #d82900)`);
      }
      const filterString = filters.length > 0 ? filters.join(' ') : '';
      flake.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background-image: url(${svgUrl});
        background-size: contain;
        background-repeat: no-repeat;
        opacity: ${opacity};
        ${filterString ? `filter: ${filterString};` : ''}
        ${gpuStyle}
      `;
    } else {
      // Default snowflake - use SVG from images folder
      const svgUrl = chrome.runtime.getURL('images/snow_flake.svg');
      if (glowAmount > 0) {
        filters.push(`drop-shadow(0 0 ${glowAmount * 6}px ${color})`);
      }
      const filterString = filters.length > 0 ? filters.join(' ') : `drop-shadow(0 0 2px ${color}80)`;
      flake.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background-image: url(${svgUrl});
        background-size: contain;
        background-repeat: no-repeat;
        opacity: ${opacity};
        filter: ${filterString};
        ${gpuStyle}
      `;
    }
    
    snowContainer.appendChild(flake);
    return snowflakeData;
  }

  // Update wind effect
  function updateWind() {
    // Mouse wind overrides normal wind
    if (settings.mouseWind) {
      const centerX = window.innerWidth / 2;
      // Calculate wind based on mouse position relative to center
      // Range: -2 to 2 (left to right)
      const maxWind = 3;
      windTarget = ((mouseX - centerX) / centerX) * maxWind;
      
      // Faster reaction for mouse wind
      globalWind += (windTarget - globalWind) * 0.05;
      return;
    }

    const windStrength = settings.wind || 1;
    if (windStrength <= 0) {
      globalWind = 0;
      return;
    }
    
    windChangeTimer++;
    
    // Change wind direction periodically
    if (windChangeTimer > 150 + Math.random() * 100) {
      windTarget = (Math.random() - 0.5) * windStrength * 2;
      windChangeTimer = 0;
    }
    
    // Smooth wind transition
    globalWind += (windTarget - globalWind) * 0.02;
  }

  // Create accumulated snow pile
  function createAccumulatedSnow(x, size, color) {
    if (!accumulationContainer || accumulatedSnow.length > 300) return;
    
    const pile = document.createElement('div');
    pile.style.cssText = `
      position: absolute;
      bottom: 0;
      left: ${x - size/2}px;
      width: ${size * 1.2}px;
      height: ${size * 0.6}px;
      background: radial-gradient(ellipse at center bottom, ${color} 0%, transparent 70%);
      border-radius: 50% 50% 0 0;
      opacity: 0.7;
      pointer-events: none;
    `;
    
    accumulationContainer.appendChild(pile);
    accumulatedSnow.push({
      element: pile,
      createdAt: Date.now()
    });
    
    // Slowly melt accumulated snow
    setTimeout(() => {
      pile.style.transition = 'opacity 3s ease-out';
      pile.style.opacity = '0';
      setTimeout(() => {
        if (pile.parentNode) {
          pile.remove();
          accumulatedSnow = accumulatedSnow.filter(s => s.element !== pile);
        }
      }, 3000);
    }, 8000 + Math.random() * 12000);
  }

  // Create snow pile on element
  function createSnowPile(x, y, size, color) {
    if (!snowContainer) return;
    
    const pile = document.createElement('div');
    pile.style.cssText = `
      position: absolute;
      left: ${x - size/2}px;
      top: ${y - size/3}px;
      width: ${size * 1.2}px;
      height: ${size * 0.6}px;
      background: radial-gradient(ellipse at center bottom, ${color} 0%, transparent 70%);
      border-radius: 50% 50% 0 0;
      opacity: 0.8;
      pointer-events: none;
      z-index: 1;
    `;
    
    snowContainer.appendChild(pile);
    
    // Melt faster than bottom snow
    setTimeout(() => {
      pile.style.transition = 'opacity 2s ease-out';
      pile.style.opacity = '0';
      setTimeout(() => pile.remove(), 2000);
    }, 4000 + Math.random() * 4000);
  }

  // Create trail element
  function createTrail(x, y, size, color) {
    if (!settings.trailEffect || !snowContainer) return;
    
    const trail = document.createElement('div');
    trail.style.cssText = `
      position: absolute;
      left: ${x}px;
      top: ${y}px;
      width: ${size * 0.5}px;
      height: ${size * 0.5}px;
      background: ${color};
      border-radius: 50%;
      opacity: 0.3;
      pointer-events: none;
      transition: opacity 0.5s ease-out;
    `;
    
    snowContainer.appendChild(trail);
    
    setTimeout(() => {
      trail.style.opacity = '0';
      setTimeout(() => trail.remove(), 500);
    }, 100);
  }

  // Update snowflake position
  function updateSnowflake(flake) {
    flake.time += 1;
    
    // Apply speed/gravity
    flake.y += flake.speed;
    
    // Apply rotation
    flake.rotation += flake.rotationSpeed;
    
    // Apply wind
    flake.x += globalWind * (flake.size / 25);
    
    // Sway/drift using sine wave
    const driftOffset = Math.sin(flake.time * flake.driftFrequency + flake.driftPhase) * flake.driftAmplitude;
    const currentX = flake.x + driftOffset;
    
    // Sparkle effect
    let currentOpacity = flake.opacity;
    if (settings.sparkleEffect) {
      flake.sparklePhase += 0.1;
      currentOpacity = flake.opacity * (0.7 + 0.3 * Math.sin(flake.sparklePhase));
      flake.element.style.opacity = currentOpacity;
    }
    
    // Trail effect
    if (settings.trailEffect && flake.time % 8 === 0) {
      createTrail(currentX, flake.y, flake.size, flake.color);
    }
    
    // Apply transform
    const scale = 0.6 + (flake.size / (settings.maxSize || 30)) * 0.4;
    flake.element.style.transform = `translate3d(${currentX}px, ${flake.y}px, 0) rotate(${flake.rotation}deg) scale(${scale})`;
    
    // Accumulate on elements logic
    if (settings.accumulateOnElements && flake.y > 0) {
      try {
        // Check less frequently for performance (every 4th frame approx)
        if (Math.floor(flake.time) % 4 === 0) {
          const element = document.elementFromPoint(currentX, flake.y + flake.size/2);
          if (element && 
              element !== snowContainer && 
              element !== accumulationContainer && 
              element !== document.body && 
              element !== document.documentElement &&
              element !== flake.initialElement && // Don't collect if started inside
              !element.classList.contains('snowflake-item')) {
            
            // 30% chance to stick if hitting an element
            if (Math.random() < 0.3) {
              createSnowPile(currentX, flake.y + flake.size/2, flake.size, flake.color);
              
              // Reset flake
              flake.y = -flake.size;
              flake.x = Math.random() * window.innerWidth;
              flake.time = 0;
              // Update color only if rainbow mode is on
              if (settings.rainbowMode === true) {
                flake.color = getSnowflakeColor(flake.shape);
              }
              return; // Stop processing
            }
          }
        }
      } catch (e) {}
    }

    // Reset when off screen (bottom)
    if (flake.y > window.innerHeight + flake.size) {
      // Accumulate snow if enabled
      if (settings.collectAtBottom && Math.random() > 0.6) {
        createAccumulatedSnow(currentX, flake.size, flake.color);
      }
      
      flake.y = -flake.size;
      flake.x = Math.random() * window.innerWidth;
      flake.time = 0;
      
      // Update color only if rainbow mode is on
      if (settings.rainbowMode === true) {
        flake.color = getSnowflakeColor(flake.shape);
      }
    }
    
    // Wrap horizontally when pushed off screen
    if (currentX > window.innerWidth + 100) {
      flake.x = -flake.driftAmplitude - 100;
    } else if (currentX < -100) {
      flake.x = window.innerWidth + flake.driftAmplitude + 100;
    }
  }

  // Animation loop with FPS control
  function animate(currentTime) {
    if (isPaused || isScrolling) {
      animationFrame = requestAnimationFrame(animate);
      return;
    }
    
    const elapsed = currentTime - lastFrameTime;
    
    if (elapsed >= targetFrameTime) {
      lastFrameTime = currentTime - (elapsed % targetFrameTime);
      
      updateWind();
      snowflakes.forEach(updateSnowflake);
    }
    
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
    
    // Set target FPS
    targetFrameTime = 1000 / (settings.fps || 60);
    
    createContainer();
    
    // Create snowflakes
    snowflakes = [];
    const count = Math.min(settings.count || 50, 300); // Cap at 300 for performance
    for (let i = 0; i < count; i++) {
      snowflakes.push(createSnowflake(true));
    }
    
    // Start animation
    lastFrameTime = performance.now();
    animate(lastFrameTime);
    
    // Setup pause on scroll if enabled
    if (settings.pauseOnScroll) {
      setupScrollPause();
    }
    
    // Setup visibility change handler
    if (settings.pauseWhenHidden) {
      setupVisibilityHandler();
    }
  }

  // Setup scroll pause feature
  function setupScrollPause() {
    // Remove existing listener if any
    window.removeEventListener('scroll', handleScroll);
    window.addEventListener('scroll', handleScroll, { passive: true });
  }

  function handleScroll() {
    isScrolling = true;
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      isScrolling = false;
      // Restart animation loop if it was paused
      if (!animationFrame && !isPaused) {
        lastFrameTime = performance.now();
        animate(lastFrameTime);
      }
    }, 150);
  }

  // Setup visibility change handler
  function setupVisibilityHandler() {
    document.addEventListener('visibilitychange', function() {
      isPaused = document.hidden;
    });
  }

  // Stop snow
  function stopSnow() {
    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
      animationFrame = null;
    }
    
    // Clean up scroll listener
    window.removeEventListener('scroll', handleScroll);
    
    if (snowContainer) {
      snowContainer.remove();
      snowContainer = null;
    }
    
    if (accumulationContainer) {
      accumulationContainer.remove();
      accumulationContainer = null;
    }
    
    snowflakes = [];
    accumulatedSnow = [];
  }

  // Load settings from storage
  function loadSettings() {
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.local.get(['snowSettings'], function(result) {
        if (result.snowSettings) {
          // Merge with defaults to ensure all properties exist
          // Important: use spread to not mutate defaults, then overwrite with saved values
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
            rainbowMode: false,  // Default is OFF
            sparkleEffect: false,
            trailEffect: false,
            pauseOnScroll: false,
            collectAtBottom: false,
            fps: 60,
            gpuAcceleration: true,
            reduceOnBattery: false,
            pauseWhenHidden: true
          };
          
          // Merge: defaults first, then saved settings
          settings = {...defaultSettings, ...result.snowSettings};
          
          // Ensure rainbowMode is explicitly boolean
          settings.rainbowMode = result.snowSettings.rainbowMode === true;
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
      if (changes.snowSettings && changes.snowSettings.newValue) {
        const newSettings = changes.snowSettings.newValue;
        // Merge with current settings
        Object.assign(settings, newSettings);
        // Ensure rainbowMode is explicitly boolean
        settings.rainbowMode = newSettings.rainbowMode === true;
        initSnow();
      }
    });
  }

  // Listen for messages from popup/advanced page
  if (typeof chrome !== 'undefined' && chrome.runtime) {
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
      if (request.action === 'toggleSnow') {
        settings.enabled = request.enabled;
        initSnow();
      } else if (request.action === 'updateSettings') {
        Object.assign(settings, request.settings);
        // Ensure rainbowMode is explicitly boolean
        settings.rainbowMode = request.settings.rainbowMode === true;
        initSnow();
      } else if (request.action === 'disableSite') {
        const currentDomain = window.location.hostname;
        if (!settings.disabledSites.includes(currentDomain)) {
          settings.disabledSites.push(currentDomain);
          if (chrome.storage) {
            chrome.storage.local.set({snowSettings: settings});
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

  // Handle window resize with debounce
  let resizeTimeout;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      if (settings.enabled && isEnabledOnCurrentSite()) {
        initSnow();
      }
    }, 300);
  }, { passive: true });
  
  // Mouse wind tracking
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
  }, { passive: true });
})();
