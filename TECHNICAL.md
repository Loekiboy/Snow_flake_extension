# 🔧 Technical Documentation

## Architecture Overview

### File Structure

```
Snow_flake_extension/
├── manifest.json          # Web extension configuration (Manifest V3)
├── background.js          # Service worker for initialization
├── snow.js               # Main script - animation logic
├── snow.css              # Minimal styles for container
├── popup.html            # Settings UI
├── popup.js              # Popup logic and storage management
├── popup.css             # Popup styles
├── demo.html             # Test/demo page
├── icons/                # Extension icons (16, 48, 128px)
├── README.md             # Main documentation
├── INSTALLATION.md       # Installation guide
└── QUICKSTART.md         # Quick start guide
```

## Core Functionality

### 1. Snowflake Animation (snow.js)

**Initialization:**
- Checks if snow is enabled for current site
- Creates container element with fixed positioning
- Generates snowflakes with unique properties

**Per Snowflake Properties:**
```javascript
{
  x: random position,           // Start X position
  y: -size,                     // Start above screen
  size: 10-30px,                // Random size
  speed: 0.5-1.5 * setting,     // Variable fall speed
  rotation: 0,                  // Current rotation
  rotationSpeed: -0.5 to 0.5,   // Very slight rotation
  driftPhase: 0-2π,             // Phase for sine wave
  driftAmplitude: 20-50px,      // Horizontal drift range
  driftFrequency: 0.01-0.03,    // Drift speed
  time: 0                       // Time counter
}
```

**Animation Loop:**
- Uses `requestAnimationFrame` for 60fps
- Calculates horizontal position via: `x + sin(time * freq + phase) * amplitude`
- Updates rotation incrementally
- Resets snowflake when off screen

**Performance Optimization:**
- CSS transform for hardware acceleration
- `will-change: transform` for GPU optimization
- No DOM manipulation during animation (only transform updates)

### 2. Settings Management (popup.js)

**Storage:**
- Uses Chrome Storage Sync API
- Settings sync between devices
- Persistent storage

**Data Structure:**
```javascript
{
  enabled: boolean,
  speed: 0.5-3.0,
  count: 10-150,
  appearance: 'snowflake' | 'ball' | 'custom',
  customImage: string (URL),
  disabledSites: string[]
}
```

**Real-time Updates:**
- Sends messages to content script on changes
- Content script listens to storage changes
- Automatic re-initialization on settings update

### 3. Appearance Options

**Snowflake (SVG):**
- Vector graphic for sharp display
- 6-pointed symmetrical snowflake
- White with drop-shadow for depth

**Ball:**
- CSS radial-gradient for 3D effect
- Highlight at 30% for realism
- Box-shadow for glow effect

**Custom:**
- Loads external image via URL
- Background-size: contain for aspect ratio preservation
- Automatic rescaling to snowflake size

### 4. Site Exclusions

**Implementatie:**
- Hostname check bij initialisatie
- Disabled sites lijst in storage
- UI voor beheer van lijst met verwijder functie

**Flow:**
1. User klikt "Uitschakelen op deze site"
2. Huidige hostname wordt toegevoegd aan lijst
3. Settings worden opgeslagen
4. Content script stopt animatie
5. Bij volgende bezoek wordt sneeuw niet geladen

## Browser Compatibiliteit

### Manifest V3
- **Chrome**: ✅ Volledig ondersteund (88+)
- **Edge**: ✅ Volledig ondersteund (88+)
- **Brave**: ✅ Volledig ondersteund
- **Firefox**: ✅ Ondersteund (109+)

### API Gebruik
- `chrome.storage.sync`: Settings opslag
- `chrome.runtime.onMessage`: Inter-script communicatie
- `chrome.tabs`: Active tab detectie
- RequestAnimationFrame: Animatie loop

## Prestatie Overwegingen

### CPU/GPU Gebruik
- **Transform-based animatie**: GPU versneld
- **No reflow/repaint**: Alleen transform wijzigt
- **RequestAnimationFrame**: Sync met display refresh

### Geheugen
- Vaste array van sneeuwvlokken (geen groei)
- Hergebruik van DOM elementen (reset ipv recreate)
- Minimale event listeners

### Netwerk
- Geen externe requests (behalve custom images)
- Icons embedded in extensie
- Geen analytics of tracking

## Uitbreidingsmogelijkheden

### Mogelijke Toevoegingen
1. **Meer vormen**: Sterren, harten, etc.
2. **Seizoenen**: Bladeren in herfst, bloemen in lente
3. **Interactiviteit**: Klikbare sneeuwvlokken
4. **Geluidseffecten**: Optionele winter geluiden
5. **Per-site instellingen**: Verschillende settings per site
6. **Keyboard shortcuts**: Snelle toggle via toetsenbord
7. **Context menu**: Rechter-klik opties

### Extensie Punten
- `snow.js`: Nieuwe vormen in `createSnowflake()`
- `popup.html`: Nieuwe UI controls
- `manifest.json`: Nieuwe permissions of commands

## Debugging

### Console Logs
Content script draait in page context:
```javascript
// Open DevTools Console
console.log(document.getElementById('snow-container-extension'));
```

### Storage Inspect
```javascript
chrome.storage.sync.get(['snowSettings'], console.log);
```

### Performance Monitor
```javascript
// In snow.js, add:
let frameCount = 0;
let lastTime = performance.now();
// In animate():
frameCount++;
if (performance.now() - lastTime > 1000) {
  console.log('FPS:', frameCount);
  frameCount = 0;
  lastTime = performance.now();
}
```

## Best Practices Gebruikt

1. ✅ **Closure pattern** voor scope isolatie
2. ✅ **RequestAnimationFrame** voor smooth animatie
3. ✅ **CSS transforms** voor performance
4. ✅ **Storage API** voor persistentie
5. ✅ **Message passing** voor communicatie
6. ✅ **Defensive coding** voor browser compatibility
7. ✅ **No external dependencies** voor security

## Licentie & Credits

Open source - vrij te gebruiken en aanpassen
Geen external libraries gebruikt - pure JavaScript/CSS
