/* ============ FAVORITES MANAGEMENT ============ */

const favoritesBtn = document.getElementById("favoritesBtn");

// ============ GET FAVORITES FROM LOCALSTORAGE ============
function getFavorites() {
  return JSON.parse(localStorage.getItem("favorites")) || [];
}

// ============ CHECK IF QUOTE IS FAVORITED ============
function isFavorite(quoteId) {
  return getFavorites().includes(quoteId);
}

// ============ ADD TO FAVORITES ============
function addToFavorites(quoteId) {
  let favorites = getFavorites();
  
  if (!favorites.includes(quoteId)) {
    favorites.push(quoteId);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    return true;
  }
  
  return false;
}

// ============ REMOVE FROM FAVORITES ============
function removeFromFavorites(quoteId) {
  let favorites = getFavorites();
  const index = favorites.indexOf(quoteId);
  
  if (index > -1) {
    favorites.splice(index, 1);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    return true;
  }
  
  return false;
}

// ============ TOGGLE FAVORITE ============
function toggleFavorite(quoteId, btn) {
  if (isFavorite(quoteId)) {
    removeFromFavorites(quoteId);
    btn.textContent = "❤️ Save";
    btn.classList.remove("active");
    showNotification("Removed from favorites");
  } else {
    addToFavorites(quoteId);
    btn.textContent = "❤️ Saved";
    btn.classList.add("active");
    showNotification("Added to favorites! ❤️");
  }
  
  // Update button state across all instances of this quote
  updateFavoriteButtons(quoteId);
}

// ============ UPDATE ALL FAVORITE BUTTONS ============
function updateFavoriteButtons(quoteId) {
  const buttons = document.querySelectorAll(`.favoriteBtn[data-quote-id="${quoteId}"]`);
  const isFav = isFavorite(quoteId);
  
  buttons.forEach(btn => {
    btn.classList.toggle("active", isFav);
    btn.textContent = isFav ? "❤️ Saved" : "❤️ Save";
  });
}

// ============ GET FAVORITE QUOTES ============
function getFavoriteQuotes() {
  const favoriteIds = getFavorites();
  return favoriteIds
    .map(id => getQuoteById(id))
    .filter(quote => quote !== undefined);
}

// ============ VIEW FAVORITES ============
function viewFavorites() {
  const favorites = getFavoriteQuotes();
  
  if (favorites.length === 0) {
    showNotification("❌ No favorites yet! Start adding some quotes to your favorites.");
    return;
  }

  // Reset pagination and filters
  currentPage = 1;
  currentCategory = "all";
  searchInput.value = "";
  
  // Remove active state from category buttons
  document.querySelectorAll(".category-btn").forEach(btn => {
    btn.classList.remove("active");
  });
  document.querySelector('[data-category="all"]').classList.add("active");

  // Display favorites
  displayQuotes(favorites);
  
  // Show count notification
  showNotification(`📌 Showing ${favorites.length} favorite quote${favorites.length !== 1 ? 's' : ''}`);
  
  // Scroll to top
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ============ EXPORT FAVORITES ============
function exportFavorites() {
  const favorites = getFavoriteQuotes();
  
  if (favorites.length === 0) {
    showNotification("No favorites to export");
    return;
  }

  let csvContent = "Quote,Author,Category\n";
  
  favorites.forEach(quote => {
    const text = `"${quote.text.replace(/"/g, '""')}"`;
    const author = `"${quote.author.replace(/"/g, '""')}"`;
    csvContent += `${text},${author},${quote.category}\n`;
  });

  // Create blob and download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  
  link.setAttribute("href", url);
  link.setAttribute("download", `love-messages-favorites-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = "hidden";
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  showNotification("✅ Favorites exported successfully!");
}

// ============ IMPORT FAVORITES ============
function importFavorites() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".json";
  
  input.addEventListener("change", (e) => {
    const file = e.target.files[0];
    
    if (!file) return;
    
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        
        if (Array.isArray(data)) {
          const validIds = data.filter(id => getQuoteById(id));
          
          if (validIds.length > 0) {
            localStorage.setItem("favorites", JSON.stringify(validIds));
            showNotification(`✅ Imported ${validIds.length} favorite quotes!`);
            displayQuotes();
          } else {
            showNotification("❌ No valid quotes found in import file");
          }
        }
      } catch (error) {
        showNotification("❌ Error importing favorites: Invalid file format");
        console.error("Import error:", error);
      }
    };
    
    reader.readAsText(file);
  });
  
  input.click();
}

// ============ SHARE FAVORITES ============
function shareFavorites() {
  const favorites = getFavoriteQuotes();
  
  if (favorites.length === 0) {
    showNotification("No favorites to share");
    return;
  }

  let shareText = "My Favorite Love Messages:\n\n";
  
  favorites.slice(0, 3).forEach(quote => {
    shareText += `"${quote.text}" — ${quote.author}\n\n`;
  });
  
  if (favorites.length > 3) {
    shareText += `...and ${favorites.length - 3} more!\n\n`;
  }
  
  shareText += "Check out Love Messages: " + window.location.href;

  if (navigator.share) {
    navigator.share({
      title: "My Favorite Love Messages",
      text: shareText,
      url: window.location.href
    }).catch(err => console.log("Share failed:", err));
  } else {
    // Fallback: Copy to clipboard
    navigator.clipboard.writeText(shareText).then(() => {
      showNotification("✅ Favorites copied to clipboard!");
    });
  }
}

// ============ CLEAR ALL FAVORITES ============
function clearAllFavorites() {
  if (confirm("Are you sure you want to clear all favorites? This cannot be undone.")) {
    localStorage.removeItem("favorites");
    showNotification("✅ All favorites cleared");
    displayQuotes();
    
    // Update all favorite buttons
    document.querySelectorAll(".favoriteBtn").forEach(btn => {
      btn.classList.remove("active");
      btn.textContent = "❤️ Save";
    });
  }
}

// ============ FAVORITE STATISTICS ============
function getFavoriteStats() {
  const favorites = getFavorites();
  const favoriteQuotes = getFavoriteQuotes();
  
  const stats = {
    total: favorites.length,
    byCategory: {}
  };

  favoriteQuotes.forEach(quote => {
    if (!stats.byCategory[quote.category]) {
      stats.byCategory[quote.category] = 0;
    }
    stats.byCategory[quote.category]++;
  });

  return stats;
}

// ============ SHOW FAVORITE STATS ============
function showFavoriteStats() {
  const stats = getFavoriteStats();
  
  let statsHTML = `<div style="padding: 20px; text-align: center;">`;
  statsHTML += `<h3 style="color: #ff3366; margin-bottom: 15px;">Favorite Statistics</h3>`;
  statsHTML += `<p style="font-size: 24px; font-weight: bold; margin: 10px 0;">${stats.total} Total Favorites</p>`;
  
  if (stats.total > 0) {
    statsHTML += `<div style="text-align: left; margin-top: 15px;">`;
    statsHTML += `<h4 style="margin-bottom: 10px;">By Category:</h4>`;
    
    Object.entries(stats.byCategory).forEach(([category, count]) => {
      statsHTML += `<div style="padding: 8px; margin: 5px 0; background: #f5f5f5; border-radius: 5px;">
        <strong>${category}:</strong> ${count}
      </div>`;
    });
    
    statsHTML += `</div>`;
  }
  
  statsHTML += `</div>`;
  
  // You could display this in a modal
  console.log(stats);
}

// ============ EVENT LISTENERS ============

// Favorites button
if (favoritesBtn) {
  favoritesBtn.addEventListener("click", viewFavorites);
}

// Update heart icon on page load
document.addEventListener("DOMContentLoaded", () => {
  const favorites = getFavorites();
  document.querySelectorAll(".favoriteBtn").forEach(btn => {
    const quoteId = parseInt(btn.getAttribute("data-quote-id"));
    if (favorites.includes(quoteId)) {
      btn.classList.add("active");
      btn.textContent = "❤️ Saved";
    }
  });
});

// ============ SYNC FAVORITES ACROSS TABS ============
window.addEventListener("storage", (e) => {
  if (e.key === "favorites") {
    // Refresh favorite buttons when favorites change in another tab
    document.querySelectorAll(".favoriteBtn").forEach(btn => {
      const quoteId = parseInt(btn.getAttribute("data-quote-id"));
      updateFavoriteButtons(quoteId);
    });
  }
});

// ============ KEYBOARD SHORTCUT ============
document.addEventListener("keydown", (e) => {
  // Alt + S = Show favorites
  if (e.altKey && e.key === "s") {
    e.preventDefault();
    viewFavorites();
  }
});
