// RSS Reader Extension - Popup Script

// Default RSS feed
const DEFAULT_FEED = {
  id: 'default-huxiu',
  name: '虎嗅网',
  url: 'https://rss.huxiu.com/'
};

// State
let feeds = [];
let currentFeedId = null;
let isLoading = false;

// DOM Elements
const mainView = document.getElementById('mainView');
const settingsView = document.getElementById('settingsView');
const feedSelect = document.getElementById('feedSelect');
const feedItems = document.getElementById('feedItems');
const loadingState = document.getElementById('loadingState');
const errorState = document.getElementById('errorState');
const errorMessage = document.getElementById('errorMessage');
const emptyState = document.getElementById('emptyState');
const feedList = document.getElementById('feedList');
const feedNameInput = document.getElementById('feedNameInput');
const feedUrlInput = document.getElementById('feedUrlInput');

// Buttons
const settingsBtn = document.getElementById('settingsBtn');
const backBtn = document.getElementById('backBtn');
const refreshBtn = document.getElementById('refreshBtn');
const addFeedBtn = document.getElementById('addFeedBtn');
const retryBtn = document.getElementById('retryBtn');
const addFirstFeedBtn = document.getElementById('addFirstFeedBtn');

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
  await loadFeeds();
  renderFeedSelector();
  
  if (feeds.length > 0) {
    currentFeedId = feeds[0].id;
    feedSelect.value = currentFeedId;
    await loadFeedContent(currentFeedId);
  } else {
    showEmptyState();
  }
});

// Event Listeners
settingsBtn.addEventListener('click', () => showSettings());
backBtn.addEventListener('click', () => showMain());
refreshBtn.addEventListener('click', () => loadFeedContent(currentFeedId));
addFeedBtn.addEventListener('click', () => addFeed());
retryBtn.addEventListener('click', () => loadFeedContent(currentFeedId));
addFirstFeedBtn.addEventListener('click', () => showSettings());
feedSelect.addEventListener('change', (e) => {
  currentFeedId = e.target.value;
  loadFeedContent(currentFeedId);
});

// Load feeds from storage
async function loadFeeds() {
  return new Promise((resolve) => {
    chrome.storage.sync.get(['rssFeeds'], (result) => {
      if (result.rssFeeds && result.rssFeeds.length > 0) {
        feeds = result.rssFeeds;
      } else {
        // Initialize with default feed
        feeds = [DEFAULT_FEED];
        saveFeeds();
      }
      resolve();
    });
  });
}

// Save feeds to storage
function saveFeeds() {
  chrome.storage.sync.set({ rssFeeds: feeds });
}

// Render feed selector
function renderFeedSelector() {
  feedSelect.innerHTML = feeds.map(feed => 
    `<option value="${feed.id}">${feed.name}</option>`
  ).join('');
}

// Show/Hide Views
function showMain() {
  mainView.classList.remove('hidden');
  settingsView.classList.add('hidden');
  renderFeedSelector();
  if (currentFeedId) {
    loadFeedContent(currentFeedId);
  } else if (feeds.length > 0) {
    currentFeedId = feeds[0].id;
    feedSelect.value = currentFeedId;
    loadFeedContent(currentFeedId);
  } else {
    showEmptyState();
  }
}

function showSettings() {
  mainView.classList.add('hidden');
  settingsView.classList.remove('hidden');
  renderFeedList();
}

// State Management
function showLoading() {
  loadingState.classList.remove('hidden');
  errorState.classList.add('hidden');
  emptyState.classList.add('hidden');
  feedItems.classList.add('hidden');
}

function hideLoading() {
  loadingState.classList.add('hidden');
}

function showError(message) {
  hideLoading();
  errorState.classList.remove('hidden');
  emptyState.classList.add('hidden');
  feedItems.classList.add('hidden');
  errorMessage.textContent = message;
}

function showEmptyState() {
  hideLoading();
  errorState.classList.add('hidden');
  emptyState.classList.remove('hidden');
  feedItems.classList.add('hidden');
}

function showFeedItems() {
  hideLoading();
  errorState.classList.add('hidden');
  emptyState.classList.add('hidden');
  feedItems.classList.remove('hidden');
}

// Load RSS Feed Content - Direct fetch in popup context
async function loadFeedContent(feedId) {
  const feed = feeds.find(f => f.id === feedId);
  if (!feed) {
    showError('未找到订阅源');
    return;
  }

  showLoading();
  isLoading = true;

  try {
    // Direct fetch in popup context - DOMParser is available here
    const response = await fetch(feed.url, {
      headers: {
        'Accept': 'application/rss+xml, application/xml, text/xml, */*'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const xmlText = await response.text();
    const items = parseRSS(xmlText);
    renderFeedItems(items, feed.name);
    showFeedItems();
  } catch (error) {
    console.error('Failed to load feed:', error);
    showError(`加载失败: ${error.message}`);
  } finally {
    isLoading = false;
  }
}

// Parse RSS XML
function parseRSS(xmlText) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlText, 'text/xml');

  // Check for parsing errors
  const parseError = doc.querySelector('parsererror');
  if (parseError) {
    throw new Error('Invalid RSS format');
  }

  const items = [];

  // Try to find items in different RSS formats
  // Standard RSS 2.0
  let itemElements = doc.querySelectorAll('item');
  
  // Atom format
  if (itemElements.length === 0) {
    itemElements = doc.querySelectorAll('entry');
  }

  itemElements.forEach(item => {
    const parsedItem = parseItem(item);
    if (parsedItem && parsedItem.title) {
      items.push(parsedItem);
    }
  });

  return items.slice(0, 50); // Limit to 50 items
}

// Parse individual item
function parseItem(item) {
  // Determine if it's RSS or Atom
  const isAtom = item.tagName === 'entry';

  if (isAtom) {
    return parseAtomItem(item);
  } else {
    return parseRSSItem(item);
  }
}

// Parse RSS 2.0 item
function parseRSSItem(item) {
  const title = getTextContent(item, 'title');
  const link = getTextContent(item, 'link');
  const description = getTextContent(item, 'description') || getTextContent(item, 'content\\:encoded') || getTextContent(item, 'content');
  const pubDate = getTextContent(item, 'pubDate') || getTextContent(item, 'dc\\:date') || getTextContent(item, 'date');
  const author = getTextContent(item, 'author') || getTextContent(item, 'dc\\:creator');

  return {
    title: title,
    link: link,
    description: description,
    pubDate: pubDate,
    author: author
  };
}

// Parse Atom item
function parseAtomItem(item) {
  const title = getTextContent(item, 'title');
  
  // Atom links can have multiple link elements with different rel attributes
  let link = '';
  const linkElements = item.querySelectorAll('link');
  linkElements.forEach(linkEl => {
    const rel = linkEl.getAttribute('rel');
    const href = linkEl.getAttribute('href');
    if (rel === 'alternate' || !rel) {
      link = href;
    }
  });
  if (!link && linkElements.length > 0) {
    link = linkElements[0].getAttribute('href');
  }

  const description = getTextContent(item, 'summary') || getTextContent(item, 'content');
  const pubDate = getTextContent(item, 'published') || getTextContent(item, 'updated');
  const author = getTextContent(item, 'author name');

  return {
    title: title,
    link: link,
    description: description,
    pubDate: pubDate,
    author: author
  };
}

// Helper function to get text content
function getTextContent(parent, tagName) {
  // Handle namespaced tags like dc:creator
  const element = parent.querySelector(tagName) || 
                  parent.querySelector(tagName.replace('\\:', ':'));
  
  if (element) {
    return element.textContent.trim();
  }
  return '';
}

// Render feed items
function renderFeedItems(items, sourceName) {
  feedItems.innerHTML = items.map(item => `
    <a href="${item.link}" target="_blank" class="feed-item">
      <div class="feed-item-title">${escapeHtml(item.title)}</div>
      <div class="feed-item-meta">
        <span class="feed-item-source">${escapeHtml(sourceName)}</span>
        <span class="feed-item-date">${formatDate(item.pubDate)}</span>
      </div>
      ${item.description ? `<div class="feed-item-desc">${escapeHtml(stripHtml(item.description))}</div>` : ''}
    </a>
  `).join('');
}

// Render feed list in settings
function renderFeedList() {
  feedList.innerHTML = feeds.map(feed => `
    <div class="feed-list-item" data-id="${feed.id}">
      <div class="feed-list-item-info">
        <div class="feed-list-item-name">${escapeHtml(feed.name)}</div>
        <div class="feed-list-item-url">${escapeHtml(feed.url)}</div>
      </div>
      <div class="feed-list-item-actions">
        ${feed.id === DEFAULT_FEED.id ? 
          '<span class="icon-btn default-feed" title="默认订阅源">⭐</span>' : 
          `<button class="icon-btn delete-btn" title="删除">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>`
        }
      </div>
    </div>
  `).join('');

  // Add delete event listeners
  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const feedItem = e.target.closest('.feed-list-item');
      const feedId = feedItem.dataset.id;
      deleteFeed(feedId);
    });
  });
}

// Add new feed
async function addFeed() {
  const name = feedNameInput.value.trim();
  const url = feedUrlInput.value.trim();

  if (!url) {
    showToast('请输入RSS地址', 'error');
    return;
  }

  // Validate URL
  try {
    new URL(url);
  } catch {
    showToast('请输入有效的URL地址', 'error');
    return;
  }

  // Check for duplicate
  if (feeds.some(f => f.url === url)) {
    showToast('该订阅源已存在', 'error');
    return;
  }

  // Generate ID
  const id = 'feed-' + Date.now();
  const feedName = name || extractFeedName(url);

  // Add feed
  feeds.push({ id, name: feedName, url });
  saveFeeds();

  // Clear inputs
  feedNameInput.value = '';
  feedUrlInput.value = '';

  // Re-render
  renderFeedList();
  showToast('添加成功', 'success');
}

// Delete feed
function deleteFeed(feedId) {
  feeds = feeds.filter(f => f.id !== feedId);
  saveFeeds();
  renderFeedList();
  
  if (currentFeedId === feedId) {
    currentFeedId = feeds.length > 0 ? feeds[0].id : null;
  }
  
  showToast('删除成功', 'success');
}

// Utility Functions
function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function stripHtml(html) {
  if (!html) return '';
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent || div.innerText || '';
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      const hours = Math.floor(diff / (1000 * 60 * 60));
      if (hours === 0) {
        const minutes = Math.floor(diff / (1000 * 60));
        return minutes <= 1 ? '刚刚' : `${minutes}分钟前`;
      }
      return `${hours}小时前`;
    } else if (days === 1) {
      return '昨天';
    } else if (days < 7) {
      return `${days}天前`;
    } else {
      return date.toLocaleDateString('zh-CN');
    }
  } catch {
    return dateStr;
  }
}

function extractFeedName(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace('www.', '');
  } catch {
    return 'RSS Feed';
  }
}

function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.remove();
  }, 2500);
}
