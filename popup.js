// Get the toggle button
const toggleButton = document.getElementById("toggle-button");

// Update the button text and send a message to the background script
function updateButton(enabled) {
  toggleButton.textContent = enabled ? "Disable" : "Enable";
}

// Get the current state from storage and update the button
browser.storage.local.get("enabled", (data) => {
  const enabled = data.enabled || false;
  updateButton(enabled);
});

// Toggle dark mode when the button is clicked
toggleButton.addEventListener("click", () => {
  browser.runtime.sendMessage({ action: "toggle" }, (response) => {
    updateButton(response.enabled);
  });
});