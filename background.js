// Function to apply or remove the cyberpunk dark mode
function toggleDarkMode(enabled, colorScheme, tabId = null) {
  const colorSchemes = {
    default: {
      backgroundColor: '#0d0d0d',
      textColor: '#00ffcc',
      accentColor: '#ff00ff',
      hoverColor: '#00ffff',
      inputBackground: '#1a1a1a',
      scrollbarThumb: '#ff00ff',
      scrollbarThumbHover: '#00ffff'
    },
    neonPurple: {
      backgroundColor: '#1a1a1a',
      textColor: '#ff00ff',
      accentColor: '#00ffcc',
      hoverColor: '#ff00ff',
      inputBackground: '#0d0d0d',
      scrollbarThumb: '#00ffcc',
      scrollbarThumbHover: '#ff00ff'
    },
    neonGreen: {
      backgroundColor: '#0d0d0d',
      textColor: '#00ff00',
      accentColor: '#ff00ff',
      hoverColor: '#00ffcc',
      inputBackground: '#1a1a1a',
      scrollbarThumb: '#00ff00',
      scrollbarThumbHover: '#ff00ff'
    },
    cyberBlue: {
      backgroundColor: '#0d0d0d',
      textColor: '#00ffff',
      accentColor: '#ff00ff',
      hoverColor: '#00ffcc',
      inputBackground: '#1a1a1a',
      scrollbarThumb: '#00ffff',
      scrollbarThumbHover: '#ff00ff'
    },
    retroPink: {
      backgroundColor: '#1a1a1a',
      textColor: '#ff00ff',
      accentColor: '#00ffcc',
      hoverColor: '#ff00ff',
      inputBackground: '#0d0d0d',
      scrollbarThumb: '#ff00ff',
      scrollbarThumbHover: '#00ffcc'
    },
    // Add more color schemes as needed
  };

  const colors = colorSchemes[colorScheme] || colorSchemes.default;

  const css = `
    * {
      background-color: ${colors.backgroundColor} !important;
      color: ${colors.textColor} !important;
      border-color: ${colors.accentColor} !important;
    }
    a {
      color: ${colors.accentColor} !important;
    }
    a:hover {
      color: ${colors.hoverColor} !important;
    }
    input, textarea, select, button {
      background-color: ${colors.inputBackground} !important;
      color: ${colors.textColor} !important;
      border: 1px solid ${colors.accentColor} !important;
    }
    button:hover {
      background-color: ${colors.accentColor} !important;
      color: ${colors.backgroundColor} !important;
    }
    table, th, td {
      background-color: ${colors.inputBackground} !important;
      color: ${colors.textColor} !important;
      border: 1px solid ${colors.accentColor} !important;
    }
    ::-webkit-scrollbar {
      width: 10px;
    }
    ::-webkit-scrollbar-track {
      background: ${colors.backgroundColor};
    }
    ::-webkit-scrollbar-thumb {
      background: ${colors.scrollbarThumb};
    }
    ::-webkit-scrollbar-thumb:hover {
      background: ${colors.scrollbarThumbHover};
    }
    [style*="background-color"], [style*="color"] {
      background-color: ${colors.backgroundColor} !important;
      color: ${colors.textColor} !important;
    }

    /* Exclude images and videos from inversion */
    img, video {
      filter: none !important;
    }
  `;

  if (tabId) {
    // Apply to a specific tab
    if (enabled) {
      browser.tabs.insertCSS(tabId, { code: css });
    } else {
      browser.tabs.removeCSS(tabId, { code: css });
    }
  } else {
    // Apply to all open tabs
    browser.tabs.query({}, (tabs) => {
      tabs.forEach((tab) => {
        if (enabled) {
          browser.tabs.insertCSS(tab.id, { code: css });
        browser.tabs.executeScript(tab.id, {
          code: `
            document.querySelectorAll('[style*="background-color"], [style*="color"]').forEach(el => {
              el.style.backgroundColor = '${colors.backgroundColor} !important';
              el.style.color = '${colors.textColor} !important';
            });
          `,
        });
        } else {
          browser.tabs.removeCSS(tab.id, { code: css });
          browser.tabs.executeScript(tab.id, {
            code: `
              document.querySelectorAll('[style*="background-color"], [style*="color"]').forEach(el => {
                el.style.backgroundColor = '';
                el.style.color = '';
              });
            `,
          });
        }
      });
    });
  }
}

// Apply dark mode to all open tabs when the extension is enabled or the color scheme is updated
function applyDarkModeToAllTabs(enabled, colorScheme) {
  browser.tabs.query({}, (tabs) => {
    tabs.forEach((tab) => {
      toggleDarkMode(enabled, colorScheme, tab.id);
    });
  });
}

// Listen for tab updates and apply dark mode if enabled
browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete") {
    browser.storage.local.get(["enabled", "colorScheme"], (data) => {
      if (data.enabled) {
        toggleDarkMode(true, data.colorScheme || "default", tabId);
      }
    });
  }
});

// Listen for messages from the popup to toggle dark mode or update color scheme
browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "toggle") {
    browser.storage.local.get(["enabled", "colorScheme"], (data) => {
      const enabled = !data.enabled;
      const colorScheme = data.colorScheme || "default";
      browser.storage.local.set({ enabled, colorScheme });
      applyDarkModeToAllTabs(enabled, colorScheme); // Apply to all tabs immediately
      sendResponse({ enabled });
    });
    return true; // Required for async response
  } else if (request.action === "updateColorScheme") {
    browser.storage.local.get("enabled", (data) => {
      const enabled = data.enabled || false;
      browser.storage.local.set({ colorScheme: request.colorScheme });
      applyDarkModeToAllTabs(enabled, request.colorScheme); // Apply to all tabs immediately
    });
  }
});

// Apply dark mode to all existing tabs when the extension is loaded
browser.storage.local.get(["enabled", "colorScheme"], (data) => {
  if (data.enabled) {
    applyDarkModeToAllTabs(true, data.colorScheme || "default");
  }
});
