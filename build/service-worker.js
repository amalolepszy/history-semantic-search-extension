/* global chrome */

// Open side panel on click
chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });

// --- EVENT LISTENERS ---

// Listen for new visits to notify the UI
chrome.history.onVisited.addListener((historyItem) => {
  chrome.runtime.sendMessage({ action: "history_updated", item: historyItem });
});