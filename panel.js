const resultsDiv = document.getElementById('results');

// Function to fetch full history on startup
function loadFullHistory() {
  chrome.history.search({ text: '', maxResults: 50 }, (data) => {
    resultsDiv.innerHTML = ''; 
    data.forEach(renderItem);
  });
}

// Helper to create the HTML for a history item
function renderItem(page) {
  const div = document.createElement('div');
  div.className = 'item';
  div.innerHTML = `
    <a href="${page.url}" target="_blank">${page.title || 'Untitled'}</a>
    <div>Last visited: ${new Date(page.lastVisitTime).toLocaleTimeString()}</div>
  `;
  // Prepend so the newest is always at the top
  resultsDiv.prepend(div);
}

// Initial load
loadFullHistory();

// Listen for the specific history update message
chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "history_updated") {
    // Option A: Refresh the whole list to ensure correct order
    loadFullHistory();
    
    // Option B: For instant feedback, just render the new item
    // renderItem(message.newItem); 
  }
});