// Function to apply or remove the cyberpunk dark mode
function toggleDarkMode(enabled) {
    const css = `
      * {
        background-color: #0d0d0d !important;
        color: #00ffcc !important;
        border-color: #ff00ff !important;
      }
      a {
        color: #ff00ff !important;
      }
      a:hover {
        color: #00ffff !important;
      }
      input, textarea, select, button {
        background-color: #1a1a1a !important;
        color: #00ffcc !important;
        border: 1px solid #ff00ff !important;
      }
      button:hover {
        background-color: #ff00ff !important;
        color: #0d0d0d !important;
      }
      table, th, td {
        background-color: #1a1a1a !important;
        color: #00ffcc !important;
        border: 1px solid #ff00ff !important;
      }
      img:not(.rISBZc), video {
        filter: invert(1) hue-rotate(180deg) !important;
      }
      ::-webkit-scrollbar {
        width: 10px;
      }
      ::-webkit-scrollbar-track {
        background: #0d0d0d;
      }
      ::-webkit-scrollbar-thumb {
        background: #ff00ff;
      }
      ::-webkit-scrollbar-thumb:hover {
        background: #00ffff;
      }
      [style*="background-color"], [style*="color"] {
        background-color: #0d0d0d !important;
        color: #00ffcc !important;
      }
    `;
  
    // Inject or remove CSS based on the toggle state
    if (enabled) {
      browser.tabs.insertCSS({ code: css });
  
      // Dynamically override inline styles
      browser.tabs.executeScript({
        code: `
          document.querySelectorAll('[style*="background-color"], [style*="color"]').forEach(el => {
            el.style.backgroundColor = '#0d0d0d !important';
            el.style.color = '#00ffcc !important';
          });
        `,
      });
    } else {
      browser.tabs.removeCSS({ code: css });
  
      // Remove dynamic overrides
      browser.tabs.executeScript({
        code: `
          document.querySelectorAll('[style*="background-color"], [style*="color"]').forEach(el => {
            el.style.backgroundColor = '';
            el.style.color = '';
          });
        `,
      });
    }
  }
  
  // Listen for tab updates and apply dark mode if enabled
  browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete") {
      browser.storage.local.get("enabled", (data) => {
        if (data.enabled) {
          toggleDarkMode(true);
        }
      });
    }
  });
  
  // Listen for messages from the popup to toggle dark mode
  browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "toggle") {
      browser.storage.local.get("enabled", (data) => {
        const enabled = !data.enabled;
        browser.storage.local.set({ enabled });
        toggleDarkMode(enabled);
        sendResponse({ enabled });
      });
      return true; // Required for async response
    }
  });