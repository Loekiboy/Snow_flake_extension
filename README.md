# ❄️ Snow Flake Extension

Een web extensie die dwarrelende sneeuwvlokken toevoegt aan webpagina's met uitgebreide aanpassingsmogelijkheden.

## ✨ Features

- 🌨️ **Realistische sneeuwval** - Sneeuwvlokken met natuurlijke beweging
- ⚡ **Variabele eigenschappen** - Elke sneeuwvlok heeft unieke:
  - Snelheid
  - Grootte
  - Rotatie (minimaal)
  - Horizontale dwarreling (gesynchroniseerd patroon)
- 🎨 **Aanpasbaar uiterlijk**:
  - Sneeuwvlok (standaard)
  - Bal
  - Eigen afbeelding (automatisch verkleind)
- ⚙️ **Instellingen**:
  - Snelheid aanpassen
  - Aantal sneeuwvlokken instellen
  - Sneeuw in-/uitschakelen
  - Specifieke sites uitsluiten
- 🌐 **Werkt op alle websites**

## 📦 Installatie

### Chrome/Edge/Brave

1. Download of kloon deze repository
2. Open Chrome en ga naar `chrome://extensions/`
3. Schakel "Ontwikkelaarsmodus" in (rechtsboven)
4. Klik op "Uitgepakte extensie laden"
5. Selecteer de map met de extensie bestanden
6. De extensie is nu geïnstalleerd! ❄️

### Firefox

1. Download of kloon deze repository
2. Open Firefox en ga naar `about:debugging#/runtime/this-firefox`
3. Klik op "Tijdelijke add-on laden"
4. Selecteer het `manifest.json` bestand
5. De extensie is nu geïnstalleerd! ❄️

## 🎮 Gebruik

1. Klik op het sneeuwvlok icoon in je browser toolbar
2. Pas de instellingen aan naar wens:
   - Schakel sneeuw in/uit met de toggle
   - Pas snelheid en aantal aan met de sliders
   - Kies je favoriete uiterlijk
   - Voer een eigen afbeelding URL in (optioneel)
3. Klik op "Instellingen opslaan"
4. Gebruik "Uitschakelen op deze site" om sneeuw op specifieke sites uit te schakelen

## 🛠️ Technische details

- **Manifest versie**: 3
- **Compatibel met**: Chrome, Edge, Brave, Firefox
- **Geen externe dependencies**
- **Lightweight**: Minimale impact op prestaties

## 📝 Bestanden structuur

```
Snow_flake_extension/
├── manifest.json          # Extensie configuratie
├── snow.js               # Hoofdscript voor sneeuwanimatie
├── snow.css              # Stijlen voor sneeuw
├── popup.html            # Instellingen popup UI
├── popup.js              # Popup logica
├── popup.css             # Popup stijlen
├── background.js         # Service worker
└── icons/                # Extensie iconen
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

## 🎯 Features in detail

### Variabele snelheid
Elke sneeuwvlok heeft een unieke valsnelheid, gecombineerd met de globale snelheidsinstelling.

### Grootte variatie
Sneeuwvlokken variëren in grootte van 10px tot 30px voor een natuurlijk effect.

### Minimale rotatie
Sneeuwvlokken roteren zeer langzaam tijdens het vallen voor extra realisme.

### Gesynchroniseerde dwarreling
Sneeuwvlokken dwarrelen horizontaal met een sinusvormig patroon, waarbij ze allemaal een soortgelijk ritme hebben maar met unieke fases en amplitudes.

## 🔧 Aanpassing

Je kunt de standaardinstellingen aanpassen in `background.js`:

```javascript
const defaultSettings = {
  enabled: true,
  speed: 1,              // 0.5 - 3.0
  count: 50,             // 10 - 150
  appearance: 'snowflake', // 'snowflake', 'ball', 'custom'
  customImage: '',
  disabledSites: []
};
```

## 📄 Licentie

Dit project is open source en vrij te gebruiken en aan te passen.

## 🤝 Bijdragen

Bijdragen zijn welkom! Voel je vrij om issues te openen of pull requests te maken.

## ❤️ Credits

Gemaakt met ❄️ voor een betere winterbeleving op het web!