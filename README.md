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
  - Star
  - Heart
  - Leaf
  - Custom Image (automatically resized)
- ⚙️ **Settings**:
  - Adjust speed
  - Set number of snowflakes
  - Toggle snow on/off
  - Exclude specific sites
  - **Accumulate Snow**: Snow piles up at the bottom of the screen!
  - **Accumulate on Objects**: Snow sticks to page elements!
- 🌐 **Works on all websites**

## 🧪 Beta Features

The following features are currently in Beta. They are experimental and may be refined in future updates:

- **Collect at Bottom**: Allows snow to pile up at the bottom of the screen. (Still buggy)
- **Accumulate on Objects**: Allows snow to stick to elements on the page. (Still buggy)
- **Mouse Controls Wind**: Wind direction follows your mouse cursor.
- **Blur Effect**: Adds a blur filter to snowflakes. (May have a weird look)
- **Custom Image**: Use your own image. (Can produce low fps)
- **Performance Settings**: Advanced FPS and battery controls. (Isn't tested)

## 📦 Installation

### Chrome/Edge/Brave/Opera

1. Download or clone this repository
2. Open `chrome://extensions/`, `edge://extensions/` or `brave://extensions/` (`chrome://extensions/` also works for Opera)
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
└── images/                # images
    ├── heart.svg
    ├── snow.svg
    ├── star.svg
    └── leaf.svg
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

### Accumulate on Objects (Beta)
Snowflakes can stick to elements on the page, such as navigation bars, images, and text blocks. This uses smart collision detection to create a realistic accumulation effect on the page content itself.

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

## 📄 License

This project is open source and free to use and modify.

## 🤝 Contributions

Contributions are welcome! Feel free to open issues or create pull requests.

## ❤️ Credits

Made with ❄️ for a better winter experience on the web!
