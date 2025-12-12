# ❄️ Snow Flake Extension

A web extension that adds falling snowflakes to web pages with extensive customization options.

## ✨ Features

- 🌨️ **Realistic Snowfall** - Snowflakes with natural movement
- ⚡ **Variable Properties** - Each snowflake has unique:
  - Speed
  - Size
  - Rotation (minimal)
  - Horizontal drift (synchronized pattern)
- 🎨 **Customizable Appearance**:
  - Snowflake (default)
  - Ball
  - Custom Image (automatically resized)
- ⚙️ **Settings**:
  - Adjust speed
  - Set number of snowflakes
  - Toggle snow on/off
  - Exclude specific sites
  - **Accumulate Snow**: Snow piles up at the bottom of the screen!
- 🌐 **Works on all websites**

## 📦 Installation

### Chrome/Edge/Brave

1. Download or clone this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" (top right)
4. Click on "Load unpacked"
5. Select the folder containing the extension files
6. The extension is now installed! ❄️

### Firefox

1. Download or clone this repository
2. Open Firefox and go to `about:debugging#/runtime/this-firefox`
3. Click on "Load Temporary Add-on"
4. Select the `manifest.json` file
5. The extension is now installed! ❄️

## 🎮 Usage

1. Click on the snowflake icon in your browser toolbar
2. Adjust the settings to your liking:
   - Toggle snow on/off
   - Enable "Accumulate Snow" to let snow pile up
   - Adjust speed and count with sliders
   - Choose your favorite appearance
   - Enter a custom image URL (optional)
3. Click on "Save Settings"
4. Use "Disable on this site" to turn off snow on specific sites

## 🛠️ Technical Details

- **Manifest Version**: 3
- **Compatible with**: Chrome, Edge, Brave, Firefox
- **No external dependencies**
- **Lightweight**: Minimal impact on performance

## 📝 File Structure

```
Snow_flake_extension/
├── manifest.json          # Extension configuration
├── snow.js               # Main script for snow animation
├── snow.css              # Styles for snow
├── popup.html            # Settings popup UI
├── popup.js              # Popup logic
├── popup.css             # Popup styles
├── background.js         # Service worker
└── icons/                # Extension icons
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

## 🎯 Features in Detail

### Variable Speed
Each snowflake has a unique falling speed, combined with the global speed setting.

### Size Variation
Snowflakes vary in size from 10px to 30px for a natural effect.

### Minimal Rotation
Snowflakes rotate very slowly while falling for extra realism.

### Synchronized Drift
Snowflakes drift horizontally with a sinusoidal pattern, where they all have a similar rhythm but with unique phases and amplitudes.

### Snow Accumulation
When enabled, snowflakes will land at the bottom of the screen and form a snow pile. They transform into small snowballs upon landing.

## 🔧 Customization

You can adjust the default settings in `background.js`:

```javascript
const defaultSettings = {
  enabled: true,
  accumulate: false,
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