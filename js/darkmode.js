/* ============ DARK MODE TOGGLE ============ */

const darkBtn = document.getElementById("darkBtn");
const html = document.documentElement;
const body = document.body;

// ============ CHECK SYSTEM PREFERENCE ============
function getSystemPreference() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

// ============ GET SAVED DARK MODE PREFERENCE ============
function getDarkModePreference() {
  const saved = localStorage.getItem("darkMode");
  
  if (saved !== null) {
    return saved === "true";
  }
  
  // Use system preference if no saved preference
  return getSystemPreference();
}

// ============ SET DARK MODE ============
function setDarkMode(isDark) {
  if (isDark) {
    body.classList.add("dark-mode");
    html.setAttribute("data-theme", "dark");
    darkBtn.textContent = "☀️"; // Sun icon for light mode
    localStorage.setItem("darkMode", "true");
  } else {
    body.classList.remove("dark-mode");
    html.setAttribute("data-theme", "light");
    darkBtn.textContent = "🌙"; // Moon icon for dark mode
    localStorage.setItem("darkMode", "false");
  }
}

// ============ TOGGLE DARK MODE ============
function toggleDarkMode() {
  const isDarkMode = body.classList.contains("dark-mode");
  setDarkMode(!isDarkMode);
}

// ============ INITIALIZE DARK MODE ============
function initializeDarkMode() {
  const isDarkMode = getDarkModePreference();
  setDarkMode(isDarkMode);
}

// ============ EVENT LISTENERS ============
darkBtn.addEventListener("click", toggleDarkMode);

// Listen for system preference changes
window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
  // Only auto-switch if user hasn't set a manual preference
  if (localStorage.getItem("darkMode") === null) {
    setDarkMode(e.matches);
  }
});

// ============ KEYBOARD SHORTCUT ============
document.addEventListener("keydown", (e) => {
  // Alt + D = Toggle dark mode
  if (e.altKey && e.key === "d") {
    e.preventDefault();
    toggleDarkMode();
  }
});

// ============ INITIALIZE ON PAGE LOAD ============
document.addEventListener("DOMContentLoaded", initializeDarkMode);

// Fallback initialization
initializeDarkMode();
