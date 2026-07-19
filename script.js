/* ============ MAIN SCRIPT - QUOTE DISPLAY & MANAGEMENT ============ */

const container = document.getElementById("quoteContainer");
const loadMoreBtn = document.getElementById("loadMoreBtn");
const searchInput = document.getElementById("searchInput");
const categoryButtons = document.querySelectorAll(".category-btn");

let currentCategory = "all";
let displayedQuotes = [];
let quotesPerPage = 6;
let currentPage = 1;

// ============ ESCAPE HTML FOR XSS PROTECTION ============
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// ============ CREATE QUOTE CARD ============
function createQuoteCard(quote, index) {
  const card = document.createElement("div");
  card.className = "card";
  card.setAttribute("data-quote-id", quote.id);

  const quoteDiv = document.createElement("div");
  quoteDiv.className = "quote";
  quoteDiv.textContent = quote.text;

  const authorDiv = document.createElement("div");
  authorDiv.className = "quote-author";
  authorDiv.textContent = `— ${escapeHtml(quote.author)}`;

  const buttonsDiv = document.createElement("div");
  buttonsDiv.className = "buttons";

  // Favorite Button
  const favBtn = document.createElement("button");
  favBtn.className = "favoriteBtn";
  favBtn.setAttribute("data-quote-id", quote.id);
  favBtn.setAttribute("aria-label", "Add to favorites");
  
  const isFavorited = isFavorite(quote.id);
  favBtn.textContent = isFavorited ? "❤️ Saved" : "❤️ Save";
  favBtn.classList.toggle("active", isFavorited);

  favBtn.addEventListener("click", () => toggleFavorite(quote.id, favBtn));

  // Share Button
  const shareBtn = document.createElement("button");
  shareBtn.className = "shareBtn";
  shareBtn.setAttribute("data-quote-id", quote.id);
  shareBtn.setAttribute("aria-label", "Share quote");
  shareBtn.textContent = "📤 Share";
  shareBtn.addEventListener("click", () => shareQuote(quote));

  // Copy Button
  const copyBtn = document.createElement("button");
  copyBtn.className = "copyBtn";
  copyBtn.setAttribute("aria-label", "Copy to clipboard");
  copyBtn.textContent = "📋 Copy";
  copyBtn.addEventListener("click", () => copyToClipboard(quote.text));

  buttonsDiv.appendChild(favBtn);
  buttonsDiv.appendChild(shareBtn);
  buttonsDiv.appendChild(copyBtn);

  card.appendChild(quoteDiv);
  card.appendChild(authorDiv);
  card.appendChild(buttonsDiv);

  return card;
}

// ============ DISPLAY QUOTES ============
function displayQuotes(quoteList = quotes) {
  container.innerHTML = "";

  // Get filtered quotes based on category and search
  let filteredQuotes = quoteList;

  if (currentCategory !== "all") {
    filteredQuotes = filteredQuotes.filter(q => q.category === currentCategory);
  }

  displayedQuotes = filteredQuotes;

  if (displayedQuotes.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1;" class="empty-state">
        <h2>No quotes found</h2>
        <p>Try adjusting your search or category filter</p>
      </div>
    `;
    loadMoreBtn.style.display = "none";
    return;
  }

  // Show paginated quotes
  const startIndex = 0;
  const endIndex = quotesPerPage * currentPage;
  const quotesToShow = displayedQuotes.slice(startIndex, endIndex);

  quotesToShow.forEach((quote, index) => {
    const card = createQuoteCard(quote, index);
    container.appendChild(card);
  });

  // Show/hide load more button
  loadMoreBtn.style.display = endIndex < displayedQuotes.length ? "block" : "none";
}

// ============ LOAD MORE FUNCTIONALITY ============
loadMoreBtn.addEventListener("click", () => {
  currentPage++;
  displayQuotes();
  
  // Smooth scroll to new quotes
  setTimeout(() => {
    document.querySelectorAll(".card")[quotesPerPage * (currentPage - 1)].scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }, 100);
});

// ============ CATEGORY FILTER ============
categoryButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    categoryButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentCategory = btn.getAttribute("data-category");
    currentPage = 1;
    displayQuotes();
  });
});

// ============ SEARCH FUNCTIONALITY ============
searchInput.addEventListener("input", (e) => {
  const query = e.target.value.trim();
  currentPage = 1;
  categoryButtons.forEach(b => b.classList.remove("active"));
  categoryButtons[0].classList.add("active");
  currentCategory = "all";

  if (query === "") {
    displayQuotes();
  } else {
    const results = searchQuotes(query);
    displayQuotes(results);
  }
});

// ============ FAVORITE MANAGEMENT ============
function getFavorites() {
  return JSON.parse(localStorage.getItem("favorites")) || [];
}

function isFavorite(quoteId) {
  return getFavorites().includes(quoteId);
}

function toggleFavorite(quoteId, btn) {
  let favorites = getFavorites();
  const index = favorites.indexOf(quoteId);

  if (index > -1) {
    favorites.splice(index, 1);
    btn.textContent = "❤️ Save";
    btn.classList.remove("active");
    showNotification("Removed from favorites");
  } else {
    favorites.push(quoteId);
    btn.textContent = "❤️ Saved";
    btn.classList.add("active");
    showNotification("Added to favorites!");
  }

  localStorage.setItem("favorites", JSON.stringify(favorites));
}

// ============ COPY TO CLIPBOARD ============
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    showNotification("Quote copied to clipboard!");
  }).catch(err => {
    console.error("Failed to copy:", err);
    showNotification("Failed to copy quote");
  });
}

// ============ SHARE QUOTE ============
function shareQuote(quote) {
  const text = `"${quote.text}" — ${quote.author}`;

  if (navigator.share) {
    navigator.share({
      title: "Love Messages",
      text: text,
      url: window.location.href
    }).catch(err => console.log("Share failed:", err));
  } else {
    // Fallback: Copy to clipboard
    copyToClipboard(text);
  }
}

// ============ NOTIFICATION SYSTEM ============
function showNotification(message) {
  // Remove existing notification if any
  const existing = document.querySelector(".notification");
  if (existing) existing.remove();

  const notification = document.createElement("div");
  notification.className = "notification";
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: #ff3366;
    color: white;
    padding: 15px 25px;
    border-radius: 30px;
    box-shadow: 0 5px 15px rgba(255, 51, 102, 0.3);
    z-index: 1000;
    animation: slideInFromRight 0.3s ease-out;
    font-weight: 600;
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = "slideInFromLeft 0.3s ease-out forwards";
    notification.style.opacity = "0";
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// ============ FAVORITES BUTTON ============
const favoritesBtn = document.getElementById("favoritesBtn");
if (favoritesBtn) {
  favoritesBtn.addEventListener("click", () => {
    const favorites = getFavorites();
    if (favorites.length === 0) {
      showNotification("No favorites yet! Add some quotes to your favorites.");
      return;
    }

    const favoriteQuotes = favorites.map(id => getQuoteById(id)).filter(q => q);
    currentPage = 1;
    categoryButtons.forEach(b => b.classList.remove("active"));
    categoryButtons[0].classList.add("active");
    currentCategory = "all";
    displayQuotes(favoriteQuotes);
    showNotification(`Showing ${favoriteQuotes.length} favorite quotes`);
  });
}

// ============ RANDOM QUOTE BUTTON (Optional) ============
function getRandomQuoteButton() {
  const randomQuote = getRandomQuote();
  container.innerHTML = "";
  const card = createQuoteCard(randomQuote, 0);
  container.appendChild(card);
  card.scrollIntoView({ behavior: "smooth" });
}

// ============ INITIALIZE APP ============
document.addEventListener("DOMContentLoaded", () => {
  displayQuotes();
  console.log("Love Messages app loaded successfully! 💕");
  console.log(`Total quotes available: ${quotes.length}`);
});

// ============ KEYBOARD SHORTCUTS ============
document.addEventListener("keydown", (e) => {
  // Ctrl/Cmd + K = Focus search
  if ((e.ctrlKey || e.metaKey) && e.key === "k") {
    e.preventDefault();
    searchInput.focus();
  }

  // Escape = Clear search
  if (e.key === "Escape" && searchInput === document.activeElement) {
    searchInput.value = "";
    searchInput.dispatchEvent(new Event("input"));
  }
});

// ============ PAGE VISIBILITY ============
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") {
    console.log("Welcome back to Love Messages! 💕");
    // Refresh favorites in case they were updated elsewhere
    displayQuotes();
  }
});
