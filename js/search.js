/* ============ SEARCH FUNCTIONALITY ============ */

const searchInput = document.getElementById("searchInput");
const container = document.getElementById("quoteContainer");

let searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
const MAX_SEARCH_HISTORY = 10;

// ============ PERFORM SEARCH ============
function performSearch(query) {
  if (query.trim() === "") {
    displayQuotes();
    return;
  }

  const results = searchQuotes(query);
  
  if (results.length === 0) {
    showNoResults(query);
    return;
  }

  // Add to search history
  addToSearchHistory(query);

  // Reset pagination
  currentPage = 1;
  
  // Display search results
  displayQuotes(results);
  
  // Show search feedback
  showSearchFeedback(results.length, query);
}

// ============ SHOW NO RESULTS ============
function showNoResults(query) {
  container.innerHTML = `
    <div style="grid-column: 1 / -1;" class="empty-state">
      <h2>No quotes found for "${escapeHtml(query)}"</h2>
      <p>Try a different search term or browse all categories</p>
    </div>
  `;
  document.getElementById("loadMoreBtn").style.display = "none";
}

// ============ SHOW SEARCH FEEDBACK ============
function showSearchFeedback(count, query) {
  const feedback = document.createElement("div");
  feedback.style.cssText = `
    text-align: center;
    padding: 15px;
    color: #999;
    font-size: 14px;
    margin-bottom: 10px;
  `;
  feedback.textContent = `Found ${count} quote${count !== 1 ? 's' : ''} matching "${query}"`;
  
  // Remove old feedback if exists
  const oldFeedback = document.querySelector('[data-search-feedback]');
  if (oldFeedback) oldFeedback.remove();
  
  feedback.setAttribute('data-search-feedback', 'true');
  container.parentElement.insertBefore(feedback, container);
}

// ============ SEARCH HISTORY ============
function addToSearchHistory(query) {
  // Remove duplicates
  searchHistory = searchHistory.filter(q => q.toLowerCase() !== query.toLowerCase());
  
  // Add new search to beginning
  searchHistory.unshift(query);
  
  // Limit history
  searchHistory = searchHistory.slice(0, MAX_SEARCH_HISTORY);
  
  // Save to localStorage
  localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
}

function getSearchHistory() {
  return JSON.parse(localStorage.getItem("searchHistory")) || [];
}

function clearSearchHistory() {
  searchHistory = [];
  localStorage.removeItem("searchHistory");
  showNotification("Search history cleared");
}

// ============ AUTOCOMPLETE SUGGESTIONS ============
function createSearchSuggestions(query) {
  if (query.trim().length < 2) return [];

  const lowerQuery = query.toLowerCase();
  const uniqueAuthors = [...new Set(quotes.map(q => q.author))];
  const uniqueCategories = getCategories();

  // Combine and filter suggestions
  const suggestions = [
    ...uniqueCategories.filter(cat => cat.toLowerCase().includes(lowerQuery)),
    ...uniqueAuthors.filter(author => author.toLowerCase().includes(lowerQuery)),
    ...quotes
      .filter(q => q.text.toLowerCase().includes(lowerQuery))
      .slice(0, 3)
      .map(q => q.text.substring(0, 50) + "...")
  ];

  // Remove duplicates
  return [...new Set(suggestions)].slice(0, 8);
}

function displaySearchSuggestions(query) {
  const suggestions = createSearchSuggestions(query);
  
  // Remove old suggestions if any
  const oldSuggestions = document.querySelector(".search-suggestions");
  if (oldSuggestions) oldSuggestions.remove();

  if (suggestions.length === 0) return;

  const suggestionsDiv = document.createElement("div");
  suggestionsDiv.className = "search-suggestions";
  suggestionsDiv.style.cssText = `
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    border: 1px solid #ffe8f0;
    border-top: none;
    border-radius: 0 0 15px 15px;
    max-height: 300px;
    overflow-y: auto;
    z-index: 100;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  `;

  suggestions.forEach(suggestion => {
    const item = document.createElement("div");
    item.style.cssText = `
      padding: 10px 15px;
      cursor: pointer;
      border-bottom: 1px solid #ffe8f0;
      transition: background 0.2s ease;
    `;
    item.textContent = suggestion;
    
    item.addEventListener("mouseenter", () => {
      item.style.background = "#fff5f7";
    });
    
    item.addEventListener("mouseleave", () => {
      item.style.background = "transparent";
    });
    
    item.addEventListener("click", () => {
      searchInput.value = suggestion;
      performSearch(suggestion);
      suggestionsDiv.remove();
    });
    
    suggestionsDiv.appendChild(item);
  });

  // Position suggestions relative to search box
  const searchBox = document.querySelector(".search-box");
  searchBox.style.position = "relative";
  searchBox.appendChild(suggestionsDiv);
}

// ============ ADVANCED SEARCH FILTERS ============
function advancedSearch(query, filters = {}) {
  let results = quotes;

  // Text search
  if (query.trim()) {
    const lowerQuery = query.toLowerCase();
    results = results.filter(q =>
      q.text.toLowerCase().includes(lowerQuery) ||
      q.author.toLowerCase().includes(lowerQuery)
    );
  }

  // Category filter
  if (filters.category && filters.category !== "all") {
    results = results.filter(q => q.category === filters.category);
  }

  // Author filter
  if (filters.author) {
    results = results.filter(q => q.author.toLowerCase() === filters.author.toLowerCase());
  }

  // Sort options
  if (filters.sort === "newest") {
    results = results.reverse();
  } else if (filters.sort === "favorites") {
    const favorites = getFavorites();
    results = results.sort((a, b) => {
      const aFav = favorites.includes(a.id) ? 1 : 0;
      const bFav = favorites.includes(b.id) ? 1 : 0;
      return bFav - aFav;
    });
  }

  return results;
}

// ============ KEYBOARD NAVIGATION ============
function setupSearchKeyboardShortcuts() {
  document.addEventListener("keydown", (e) => {
    // Ctrl/Cmd + F = Focus search (override browser search)
    if ((e.ctrlKey || e.metaKey) && e.key === "f") {
      e.preventDefault();
      searchInput.focus();
      searchInput.select();
    }

    // Escape = Clear search
    if (e.key === "Escape" && document.activeElement === searchInput) {
      searchInput.value = "";
      performSearch("");
      searchInput.blur();
      // Remove suggestions
      const suggestions = document.querySelector(".search-suggestions");
      if (suggestions) suggestions.remove();
    }
  });
}

// ============ EVENT LISTENERS ============

// Real-time search with debounce
let searchTimeout;
searchInput.addEventListener("input", (e) => {
  clearTimeout(searchTimeout);
  const query = e.target.value;
  
  // Show suggestions while typing
  if (query.length > 0) {
    displaySearchSuggestions(query);
  } else {
    const suggestions = document.querySelector(".search-suggestions");
    if (suggestions) suggestions.remove();
  }

  // Debounce actual search
  searchTimeout = setTimeout(() => {
    performSearch(query);
  }, 300);
});

// Clear suggestions when clicking outside
document.addEventListener("click", (e) => {
  if (!e.target.closest(".search-box")) {
    const suggestions = document.querySelector(".search-suggestions");
    if (suggestions) suggestions.remove();
  }
});

// ============ SEARCH HISTORY UI ============
function showSearchHistoryUI() {
  const history = getSearchHistory();
  
  if (history.length === 0) {
    showNotification("No search history");
    return;
  }

  let historyHTML = "<div style='padding: 20px; max-width: 400px;'>";
  historyHTML += "<h3 style='margin-bottom: 15px; color: #ff3366;'>Recent Searches</h3>";
  
  history.forEach(query => {
    historyHTML += `
      <div style='
        padding: 10px;
        background: #f5f5f5;
        border-radius: 8px;
        margin-bottom: 8px;
        cursor: pointer;
        transition: background 0.2s;
      ' onclick="searchInput.value='${query}'; performSearch('${query}');">
        ${query}
      </div>
    `;
  });
  
  historyHTML += "<button onclick='clearSearchHistory()' style='width: 100%; margin-top: 10px;'>Clear History</button>";
  historyHTML += "</div>";
  
  // You could display this in a modal or tooltip
}

// ============ INITIALIZE ============
document.addEventListener("DOMContentLoaded", setupSearchKeyboardShortcuts);
