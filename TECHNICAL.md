# 🔧 Technical Documentation

## Architecture Overview

### File Structure

```
Snow_flake_extension/
├── manifest.json          # Web extension configuration (Manifest V3)
├── background.js          # Service worker for initialization
├── snow.js                # Main script - animation logic
├── snow.css               # Minimal styles for container
├── popup.html             # Settings UI
├── popup.js               # Popup logic and storage management
├── popup.css              # Popup styles
├── demo.html              # Test/demo page
├── icons/                 # Extension icons (16, 48, 128px)
├── README.md              # Main documentation
├── INSTALLATION.md        # Installation guide
└── QUICKSTART.md          # Quick start guide
```

## Core Functionality

### 1. Snowflake Animation (snow.js)

**Initialization:**
- Checks if snow is enabled for the current site
- Creates a fixed container (can sit in front or behind page content)
- Generates snowflakes with unique properties

**Per Snowflake Properties:**
```javascript
{
  x: random position,           // Start X position
  y: -size,                     // Start above the viewport
  size: 10-30px,                // Random size
  speed: 0.5-1.5 * setting,     // Variable fall speed
  rotation: 0,                  // Current rotation
  rotationSpeed: -0.5 to 0.5,   // Slight rotation
  driftPhase: 0-2π,             // Phase for sine wave
  driftAmplitude: 20-50px,      // Horizontal drift range
  driftFrequency: 0.01-0.03,    // Drift speed
  time: 0                       // Time counter
}
```

**Animation Loop:**
- Uses `requestAnimationFrame` for smooth 60fps
- Horizontal position: `x + sin(time * freq + phase) * amplitude`
- Rotation increments each frame
- Resets snowflake when it leaves the viewport

**Performance Optimization:**
- CSS transforms for hardware acceleration
- Minimal DOM work (only transform updates)
- Fixed-size array of snowflakes to avoid growth

### 2. Settings Management (popup.js)

**Storage:**
- Uses `chrome.storage.local` (persistent, not synced)
- Single object under `snowSettings`

**Data Structure:**
```javascript
{
  enabled: boolean,
  speed: 0.5-3.0,
  count: 10-150,
  maxSize: 10-50,
  appearance: 'snowflake' | 'ball',
  disabledSites: string[],
  behindContent: boolean
}
```

**Real-time Updates:**
- Popup sends `updateSettings` or `toggleSnow` messages
- Content script listens to storage changes and messages
- Re-initializes snow with latest settings

### 3. Appearance Options

**Snowflake (SVG):**
- Bundled vector for crisp rendering
- White with subtle drop shadow

**Ball:**
- CSS radial-gradient for a soft, round flake
- Glow via box-shadow

### 4. Site Exclusions

**Behavior:**
- Hostname is checked before showing snow
- Disabled sites stored in `snowSettings.disabledSites`
- Popup UI lets users add/remove current site

**Flow:**
1. User clicks “Disable on this site”
2. Hostname is added to the list and saved
3. Content script stops snow on that domain
4. On future visits, snow will not start

## Browser Compatibility

### Manifest V3
- **Chrome**: ✅ Supported (88+)
- **Edge**: ✅ Supported (88+)
- **Brave**: ✅ Supported
- **Firefox**: ✅ Supported (109+)

### API Usage
- `chrome.storage.local`: Settings storage
- `chrome.runtime.onMessage`: Communication between popup/content
- `chrome.tabs`: Active tab detection
- `requestAnimationFrame`: Animation loop

## Performance Considerations

### CPU/GPU
- Transform-based animation (GPU-friendly)
- No layout thrashing; only transforms change
- Frame scheduling via `requestAnimationFrame`

### Memory
- Fixed pool of snowflake objects
- DOM nodes are reused (reset instead of recreate)
- Minimal listeners

### Network
- No external requests
- All assets bundled (icons, SVG)

## Extension Points

- `snow.js`: Add new appearances in `createSnowflake()`
- `popup.html`: Add new controls
- `manifest.json`: Extend permissions/commands if needed

## Debugging

### Console
```javascript
console.log(document.getElementById('snow-container-extension'));
```

### Storage Inspect
```javascript
chrome.storage.local.get(['snowSettings'], console.log);
```

### Performance Probe
```javascript
// In snow.js
let frameCount = 0;
let lastTime = performance.now();
function logFps() {
  frameCount++;
  const now = performance.now();
  if (now - lastTime > 1000) {
    console.log('FPS:', frameCount);
    frameCount = 0;
    lastTime = now;
  }
}
// Call logFps() inside animate()
```

## Best Practices Used

1. ✅ IIFE/closure for scope isolation
2. ✅ `requestAnimationFrame` for smooth animation
3. ✅ CSS transforms for performance
4. ✅ Storage API for persistence
5. ✅ Message passing between popup and content
6. ✅ No external dependencies

## License & Credits

Open source — free to use and modify.
Pure JavaScript/CSS; no external libraries.
