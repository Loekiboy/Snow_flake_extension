# 🔧 Technische Documentatie

## Architectuur Overzicht

### Bestanden Structuur

```
Snow_flake_extension/
├── manifest.json          # Web extension configuratie (Manifest V3)
├── background.js          # Service worker voor initialisatie
├── snow.js               # Hoofdscript - animatie logica
├── snow.css              # Minimale stijlen voor container
├── popup.html            # Instellingen UI
├── popup.js              # Popup logica en opslag beheer
├── popup.css             # Popup stijlen
├── demo.html             # Test/demo pagina
├── icons/                # Extensie iconen (16, 48, 128px)
├── README.md             # Hoofddocumentatie
├── INSTALLATION.md       # Installatie gids
└── QUICKSTART.md         # Snelle start gids
```

## Kernfunctionaliteit

### 1. Sneeuwvlok Animatie (snow.js)

**Initialisatie:**
- Controleert of sneeuw is ingeschakeld voor huidige site
- Maakt container element aan met fixed positioning
- Genereert sneeuwvlokken met unieke eigenschappen

**Per Sneeuwvlok Eigenschappen:**
```javascript
{
  x: random position,           // Start X positie
  y: -size,                     // Start boven scherm
  size: 10-30px,                // Willekeurige grootte
  speed: 0.5-1.5 * setting,     // Variabele valsnelheid
  rotation: 0,                  // Huidige rotatie
  rotationSpeed: -0.5 to 0.5,   // Zeer lichte rotatie
  driftPhase: 0-2π,             // Fase voor sine golf
  driftAmplitude: 20-50px,      // Horizontale drift bereik
  driftFrequency: 0.01-0.03,    // Drift snelheid
  time: 0                       // Tijd counter
}
```

**Animatie Loop:**
- Gebruikt `requestAnimationFrame` voor 60fps
- Berekent horizontale positie via: `x + sin(time * freq + phase) * amplitude`
- Update rotatie incrementeel
- Reset sneeuwvlok wanneer buiten scherm

**Prestatie Optimalisatie:**
- CSS transform voor hardware acceleratie
- `will-change: transform` voor GPU optimalisatie
- Geen DOM manipulatie tijdens animatie (alleen transform updates)

### 2. Instellingen Beheer (popup.js)

**Opslag:**
- Gebruikt Chrome Storage Sync API
- Instellingen synchroniseren tussen apparaten
- Persistent opslag

**Data Structuur:**
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
- Stuurt berichten naar content script bij wijzigingen
- Content script luistert naar storage changes
- Automatische herinitialisatie bij settings update

### 3. Uiterlijk Opties

**Sneeuwvlok (SVG):**
- Vector grafiek voor scherpe weergave
- 6-puntige symmetrische sneeuwvlok
- Wit met drop-shadow voor depth

**Bal:**
- CSS radial-gradient voor 3D effect
- Lichtpunt op 30% voor realisme
- Box-shadow voor glow effect

**Custom:**
- Laadt externe afbeelding via URL
- Background-size: contain voor behoud aspect ratio
- Automatische rescaling naar sneeuwvlok grootte

### 4. Site Exclusies

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
