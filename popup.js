// Get the toggle button and color scheme dropdown
const toggleButton = document.getElementById("toggle-button");
const colorSchemeSelect = document.getElementById("color-scheme");

// Update the button text
function updateButton(enabled) {
  toggleButton.textContent = enabled ? "Disable" : "Enable";
}

// Get the current state from storage and update the button and dropdown
browser.storage.local.get(["enabled", "colorScheme"], (data) => {
  const enabled = data.enabled || false;
  const colorScheme = data.colorScheme || "default";
  updateButton(enabled);
  colorSchemeSelect.value = colorScheme;
});

// Toggle dark mode when the button is clicked
toggleButton.addEventListener("click", () => {
  const colorScheme = colorSchemeSelect.value;
  browser.runtime.sendMessage({ action: "toggle", colorScheme }, (response) => {
    updateButton(response.enabled);
  });
});

// Update color scheme when the dropdown changes
colorSchemeSelect.addEventListener("change", (event) => {
  const colorScheme = event.target.value;
  browser.storage.local.set({ colorScheme });
  browser.runtime.sendMessage({ action: "updateColorScheme", colorScheme });
});