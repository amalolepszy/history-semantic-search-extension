# 🧠 History Semantic Search Extension
A Manifest V3 Chrome Extension that replaces the standard history view with an AI-powered Semantic Search side panel.
Unlike standard history search which only matches exact keywords, this extension uses OpenAI Embeddings and Vector Search to understand the meaning of your search query.
Example: Searching for "how to center a div" will return results about CSS Flexbox or Grid tutorials, even if the exact phrase isn't in the title.

## ✨ Features
- 🔍 Semantic Search: Find history entries by concept, not just keywords.
- ⚡ Real-time Indexing: Automatically generates embeddings for every new page you visit.
- 📂 Native Side Panel: Integrates seamlessly into the Chrome browser interface.
- 🔐 Private & Secure: Your OpenAI API Key is stored locally in your browser (chrome.storage).
- ⚛️ Built with React: Modern, responsive UI using React and Hooks.

## 🚀 Quick start
### 1. Clone the repository
```
git clone https://github.com/amalolepszy/history-semantic-search-extension.git
cd history-semantic-search-extension
```
### 2. Load into Chrome
  1. Open Chrome and navigate to `chrome://extensions/`.
  2. Toggle Developer mode in the top right corner.
  3. Click the Load unpacked button.
  4. Select the `build` from the repository.

##  Development Guide
### Prerequisites
- Node.js & npm installed.

### 1. Clone the repository
```
git clone https://github.com/amalolepszy/history-semantic-search-extension.git
cd history-semantic-search-extension
```

### 2. Install Dependencies
```
npm install
```

### 3. Build the extension
```
npm run build
```
## 📖 How to Use
### 1. Setup API Key
  1. Click the extension icon in the Chrome toolbar to open the Side Panel.
  2. Paste your OpenAI API Key (starts with sk-...) into the input field at the top.
  3. Click Save.

### 2. Browsing (Automatic Indexing)
  1. Just browse the web as normal!
  2. When you visit a page, the extension detects it.
  3. It sends the title and URL to OpenAI to generate a "vector" (embedding).
  4. This vector is saved locally in your browser.

### 3. Performing a Semantic Search
  1. Open the Side Panel.
  2. Type a concept (e.g., "funny cat videos" or "coding tutorials").
  3. Click the **Search!** button or press Enter.
  4. The extension calculates the cosine similarity between your query and your history, showing the most relevant results first with a Match Score (e.g., 85% Match).
