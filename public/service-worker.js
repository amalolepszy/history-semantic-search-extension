/* global chrome */

// Open side panel on click
chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });

// --- EVENT LISTENERS ---

// 1. Auto-generate on new visit
chrome.history.onVisited.addListener(async (historyItem) => {
  chrome.runtime.sendMessage({ action: "history_updated", item: historyItem });
  await generateEmbedding(historyItem);
});

// 2. Listen for manual requests from React UI
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "generate_missing_embeddings") {
    processBatch(message.items);
  }
});

// --- CORE LOGIC ---

async function processBatch(items) {
  // Loop through items and generate embeddings one by one
  for (const item of items) {
    await generateEmbedding(item);
  }
}

async function generateEmbedding(item) {
  try {
    const keyData = await chrome.storage.local.get("openai_key");
    const apiKey = keyData.openai_key;
    if (!apiKey) return;

    // Check if embedding already exists to save money
    const storageKey = `vec_${item.id}`;
    const existing = await chrome.storage.local.get(storageKey);
    if (existing[storageKey]) return; // Skip if exists

    console.log(`Generating embedding for: ${item.title}`);

    const formattedDate = new Date(item.lastVisitTime).toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const textToEmbed = `Title: ${item.title || "Untitled"} - URL: ${item.url} - Last Visit Time: ${formattedDate} - Visit Count: ${item.visitCount}`;

    console.log("textToEmbed: " + textToEmbed);

    const response = await fetch("https://api.openai.com/v1/embeddings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "text-embedding-3-small",
        input: textToEmbed
      })
    });

    const result = await response.json();

    if (result.data && result.data[0]) {
      const embedding = result.data[0].embedding;
      await chrome.storage.local.set({ [storageKey]: embedding });
    }

  } catch (error) {
    console.error("Embedding error:", error);
  }
}