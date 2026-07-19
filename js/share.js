/* ============ SHARE FUNCTIONALITY ============ */

// ============ SHARE QUOTE ============
function shareQuote(quote) {
  const text = `"${quote.text}" — ${quote.author}`;
  const url = window.location.href;

  if (navigator.share) {
    navigator.share({
      title: "Love Messages",
      text: text,
      url: url
    }).catch(err => console.log("Share failed:", err));
  } else {
    // Fallback: Show share options
    showShareOptions(text, quote);
  }
}

// ============ SHOW SHARE OPTIONS ============
function showShareOptions(text, quote) {
  const shareModal = document.createElement("div");
  shareModal.className = "share-modal";
  shareModal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    animation: fadeIn 0.3s ease-out;
  `;

  const modal = document.createElement("div");
  modal.style.cssText = `
    background: white;
    padding: 30px;
    border-radius: 20px;
    max-width: 400px;
    width: 90%;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
    animation: slideInFromTop 0.3s ease-out;
  `;

  modal.innerHTML = `
    <h2 style="color: #ff3366; margin-bottom: 20px; text-align: center;">Share Quote</h2>
    
    <div style="margin-bottom: 20px;">
      <p style="color: #666; margin-bottom: 15px; text-align: center; font-style: italic;">
        "${quote.text}"
      </p>
      <p style="color: #999; text-align: center; font-size: 14px;">— ${quote.author}</p>
    </div>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 15px;">
      <button onclick="copyShareText('${text.replace(/'/g, "\\'")}'); closeShareModal();" style="
        background: #4267B2;
        padding: 12px;
        border-radius: 10px;
        border: none;
        color: white;
        cursor: pointer;
        font-weight: 600;
      ">
        📋 Copy
      </button>
      
      <button onclick="shareViaWhatsApp('${encodeURIComponent(text)}');" style="
        background: #25D366;
        padding: 12px;
        border-radius: 10px;
        border: none;
        color: white;
        cursor: pointer;
        font-weight: 600;
      ">
        💬 WhatsApp
      </button>

      <button onclick="shareViaTwitter('${encodeURIComponent(text)}');" style="
        background: #1DA1F2;
        padding: 12px;
        border-radius: 10px;
        border: none;
        color: white;
        cursor: pointer;
        font-weight: 600;
      ">
        𝕏 Twitter
      </button>

      <button onclick="shareViaEmail('${encodeURIComponent(quote.text)}', '${encodeURIComponent(quote.author)}');" style="
        background: #EA4335;
        padding: 12px;
        border-radius: 10px;
        border: none;
        color: white;
        cursor: pointer;
        font-weight: 600;
      ">
        📧 Email
      </button>
    </div>

    <button onclick="closeShareModal();" style="
      width: 100%;
      padding: 12px;
      background: #f5f5f5;
      border: none;
      border-radius: 10px;
      color: #333;
      font-weight: 600;
      cursor: pointer;
    ">
      Close
    </button>
  `;

  shareModal.appendChild(modal);
  document.body.appendChild(shareModal);

  shareModal.addEventListener("click", (e) => {
    if (e.target === shareModal) {
      closeShareModal();
    }
  });
}

// ============ CLOSE SHARE MODAL ============
function closeShareModal() {
  const modal = document.querySelector(".share-modal");
  if (modal) {
    modal.style.animation = "slideInFromTop 0.3s ease-out reverse";
    setTimeout(() => modal.remove(), 300);
  }
}

// ============ COPY SHARE TEXT ============
function copyShareText(text) {
  navigator.clipboard.writeText(text).then(() => {
    showNotification("✅ Quote copied to clipboard!");
  }).catch(err => {
    console.error("Copy failed:", err);
    showNotification("❌ Failed to copy quote");
  });
}

// ============ SHARE VIA WHATSAPP ============
function shareViaWhatsApp(text) {
  const url = `https://wa.me/?text=${text}`;
  window.open(url, "_blank");
  closeShareModal();
}

// ============ SHARE VIA TWITTER ============
function shareViaTwitter(text) {
  const url = `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(window.location.href)}&hashtags=lovemessages,quotes`;
  window.open(url, "_blank");
  closeShareModal();
}

// ============ SHARE VIA FACEBOOK ============
function shareViaFacebook() {
  const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`;
  window.open(url, "_blank");
  closeShareModal();
}

// ============ SHARE VIA EMAIL ============
function shareViaEmail(quoteText, author) {
  const subject = encodeURIComponent("Check out this beautiful love message!");
  const body = encodeURIComponent(`I found this beautiful quote:\n\n"${decodeURIComponent(quoteText)}" — ${decodeURIComponent(author)}\n\nCheck it out: ${window.location.href}`);
  window.location.href = `mailto:?subject=${subject}&body=${body}`;
  closeShareModal();
}

// ============ SHARE VIA TELEGRAM ============
function shareViaTelegram(text) {
  const url = `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${text}`;
  window.open(url, "_blank");
  closeShareModal();
}

// ============ GENERATE SHAREABLE IMAGE ============
async function generateShareImage(quote) {
  try {
    // Using HTML2Canvas if available, otherwise show notification
    if (typeof html2canvas === "undefined") {
      showNotification("Feature requires additional library. Copy quote instead!");
      return;
    }

    const element = document.createElement("div");
    element.style.cssText = `
      width: 800px;
      height: 600px;
      background: linear-gradient(135deg, #ff3366 0%, #ff8ab3 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      padding: 60px;
      color: white;
      text-align: center;
      font-family: Poppins, sans-serif;
      position: absolute;
      left: -9999px;
    `;

    const text = document.createElement("p");
    text.textContent = `"${quote.text}"`;
    text.style.cssText = `
      font-size: 36px;
      font-weight: 600;
      margin-bottom: 40px;
      line-height: 1.6;
    `;

    const author = document.createElement("p");
    author.textContent = `— ${quote.author}`;
    author.style.cssText = `
      font-size: 24px;
      font-weight: 400;
      opacity: 0.9;
    `;

    element.appendChild(text);
    element.appendChild(author);
    document.body.appendChild(element);

    const canvas = await html2canvas(element);
    const link = document.createElement("a");
    link.href = canvas.toDataURL();
    link.download = `love-message-${quote.id}.png`;
    link.click();

    document.body.removeChild(element);
    showNotification("✅ Quote image downloaded!");
  } catch (error) {
    console.error("Image generation error:", error);
    showNotification("Error generating image");
  }
}

// ============ QUICK SHARE BUTTONS ============
function addQuickShareButtons(container) {
  const quickShare = document.createElement("div");
  quickShare.className = "quick-share";
  quickShare.style.cssText = `
    display: flex;
    gap: 10px;
    justify-content: center;
    margin-top: 20px;
    flex-wrap: wrap;
  `;

  const platforms = [
    { name: "WhatsApp", icon: "💬", action: "shareViaWhatsApp" },
    { name: "Twitter", icon: "𝕏", action: "shareViaTwitter" },
    { name: "Telegram", icon: "✈️", action: "shareViaTelegram" },
  ];

  platforms.forEach(platform => {
    const btn = document.createElement("button");
    btn.textContent = `${platform.icon} ${platform.name}`;
    btn.style.cssText = `
      padding: 8px 12px;
      font-size: 12px;
      background: #f5f5f5;
      border: 1px solid #ffe8f0;
      border-radius: 20px;
      cursor: pointer;
      transition: all 0.3s ease;
    `;
    btn.addEventListener("mouseover", () => {
      btn.style.background = "#ff3366";
      btn.style.color = "white";
    });
    btn.addEventListener("mouseout", () => {
      btn.style.background = "#f5f5f5";
      btn.style.color = "#333";
    });
    quickShare.appendChild(btn);
  });

  container.appendChild(quickShare);
}

// ============ SHARE QUOTE COUNT ============
function trackShareCount(quoteId) {
  let shares = JSON.parse(localStorage.getItem("quoteShares")) || {};
  
  if (!shares[quoteId]) {
    shares[quoteId] = 0;
  }
  
  shares[quoteId]++;
  localStorage.setItem("quoteShares", JSON.stringify(shares));
}

// ============ GET MOST SHARED QUOTES ============
function getMostSharedQuotes() {
  const shares = JSON.parse(localStorage.getItem("quoteShares")) || {};
  
  const mostShared = Object.entries(shares)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([id, count]) => ({
      quote: getQuoteById(parseInt(id)),
      shares: count
    }))
    .filter(item => item.quote);

  return mostShared;
}

// ============ INITIALIZE SHARE TRACKING ============
document.addEventListener("DOMContentLoaded", () => {
  // Track when users share
  document.addEventListener("click", (e) => {
    if (e.target.closest(".shareBtn")) {
      const quoteId = e.target.closest(".shareBtn").getAttribute("data-quote-id");
      if (quoteId) {
        trackShareCount(parseInt(quoteId));
      }
    }
  });
});
