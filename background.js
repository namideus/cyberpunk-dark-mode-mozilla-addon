// Inject the cyberpunk dark mode CSS into all web pages
function applyCyberpunkDarkMode() {
    const css = `
      /* Include the CSS from styles.css */
      body, html {
        background-color: #0d0d0d !important;
        color: #00ffcc !important;
      }
      p, h1, h2, h3, h4, h5, h6, span, div, a {
        color: #00ffcc !important;
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
    `;
  
    // Inject the CSS into the current page
    browser.tabs.insertCSS({ code: css });
  }
  
  // Apply the dark mode when the extension is loaded
  browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete") {
      applyCyberpunkDarkMode();
    }
  });