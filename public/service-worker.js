// Open the side panel when the icon is clicked
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));

// Listen for new history entries
chrome.history.onVisited.addListener((historyItem) => {
  // Notify the side panel that history has changed
  chrome.runtime.sendMessage({ 
    action: "history_updated", 
    newItem: historyItem 
  });
});