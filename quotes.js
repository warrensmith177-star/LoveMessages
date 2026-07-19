// ============ EXPANDED QUOTES DATABASE ============

const quotes = [
  // ============ ROMANTIC ============
  { id: 1, category: "Romantic", text: "I love you more every single day.", author: "Unknown" },
  { id: 2, category: "Romantic", text: "You are my today and all of my tomorrows.", author: "Leo Christopher" },
  { id: 3, category: "Romantic", text: "In your eyes, I found my home.", author: "Unknown" },
  { id: 4, category: "Romantic", text: "My heart belongs to you.", author: "Unknown" },
  { id: 5, category: "Romantic", text: "You make my heart skip a beat every single time.", author: "Unknown" },
  { id: 6, category: "Romantic", text: "Loving you is like breathing - essential and natural.", author: "Unknown" },
  { id: 7, category: "Romantic", text: "You are the best decision I ever made.", author: "Unknown" },
  { id: 8, category: "Romantic", text: "Forever with you feels like home.", author: "Unknown" },
  { id: 9, category: "Romantic", text: "Your love is my favorite place to be.", author: "Unknown" },
  { id: 10, category: "Romantic", text: "I fall in love with you more every day.", author: "Unknown" },

  // ============ GOOD MORNING ============
  { id: 11, category: "Good Morning", text: "Good morning, my love. May your day be as beautiful as your smile.", author: "Unknown" },
  { id: 12, category: "Good Morning", text: "Rise and shine! Another beautiful day to love you.", author: "Unknown" },
  { id: 13, category: "Good Morning", text: "Good morning to the love of my life.", author: "Unknown" },
  { id: 14, category: "Good Morning", text: "Every morning feels blessed when I wake up thinking of you.", author: "Unknown" },
  { id: 15, category: "Good Morning", text: "Start your day with a smile - I'm thinking of you.", author: "Unknown" },
  { id: 16, category: "Good Morning", text: "Good morning, beautiful. Let's make today amazing together.", author: "Unknown" },
  { id: 17, category: "Good Morning", text: "You make my mornings brighter just by existing.", author: "Unknown" },
  { id: 18, category: "Good Morning", text: "The best part of waking up is thinking of you.", author: "Unknown" },
  { id: 19, category: "Good Morning", text: "Good morning, my sunshine. You light up my world.", author: "Unknown" },
  { id: 20, category: "Good Morning", text: "Every new day is a gift when I have you in my life.", author: "Unknown" },

  // ============ GOOD NIGHT ============
  { id: 21, category: "Good Night", text: "Sleep peacefully knowing someone loves you deeply.", author: "Unknown" },
  { id: 22, category: "Good Night", text: "Good night, my love. Dream of me tonight.", author: "Unknown" },
  { id: 23, category: "Good Night", text: "Sweet dreams and peaceful sleep. I'll be thinking of you.", author: "Unknown" },
  { id: 24, category: "Good Night", text: "Sleep tight, my heart is with you tonight.", author: "Unknown" },
  { id: 25, category: "Good Night", text: "Good night to the most wonderful person in my life.", author: "Unknown" },
  { id: 26, category: "Good Night", text: "Rest well, tomorrow I'll love you even more.", author: "Unknown" },
  { id: 27, category: "Good Night", text: "May your dreams be as sweet as you are.", author: "Unknown" },
  { id: 28, category: "Good Night", text: "Good night, love. Sleep knowing you mean everything to me.", author: "Unknown" },
  { id: 29, category: "Good Night", text: "Close your eyes and think of me. Good night, darling.", author: "Unknown" },
  { id: 30, category: "Good Night", text: "Tonight I'll dream of you. Good night, my love.", author: "Unknown" },

  // ============ ANNIVERSARY ============
  { id: 31, category: "Anniversary", text: "Every year with you feels like another chapter in our beautiful love story.", author: "Unknown" },
  { id: 32, category: "Anniversary", text: "Happy Anniversary to my best friend and soulmate.", author: "Unknown" },
  { id: 33, category: "Anniversary", text: "Cheers to more years of laughter, love, and unforgettable memories.", author: "Unknown" },
  { id: 34, category: "Anniversary", text: "One more year down, forever to go with you.", author: "Unknown" },
  { id: 35, category: "Anniversary", text: "Celebrating the day I found my forever.", author: "Unknown" },
  { id: 36, category: "Anniversary", text: "Another year, another reason to fall deeper in love with you.", author: "Unknown" },
  { id: 37, category: "Anniversary", text: "Happy Anniversary to the love of my life.", author: "Unknown" },
  { id: 38, category: "Anniversary", text: "Thank you for another beautiful year of being mine.", author: "Unknown" },
  { id: 39, category: "Anniversary", text: "With you, every day feels like a celebration.", author: "Unknown" },
  { id: 40, category: "Anniversary", text: "Happy Anniversary! Here's to us and our forever.", author: "Unknown" },

  // ============ BIRTHDAY ============
  { id: 41, category: "Birthday", text: "Happy Birthday to the love of my life.", author: "Unknown" },
  { id: 42, category: "Birthday", text: "Another year older, but more beautiful than ever. Happy Birthday!", author: "Unknown" },
  { id: 43, category: "Birthday", text: "On your special day, I just want you to know how much you mean to me.", author: "Unknown" },
  { id: 44, category: "Birthday", text: "Happy Birthday to my reason for smiling every day.", author: "Unknown" },
  { id: 45, category: "Birthday", text: "Wishing the happiest of birthdays to my favorite person.", author: "Unknown" },
  { id: 46, category: "Birthday", text: "You deserve all the happiness in the world. Happy Birthday!", author: "Unknown" },
  { id: 47, category: "Birthday", text: "Happy Birthday to the love of my life. Today and every day is yours.", author: "Unknown" },
  { id: 48, category: "Birthday", text: "Make a wish - you deserve everything and more. Happy Birthday!", author: "Unknown" },
  { id: 49, category: "Birthday", text: "One more year to love you more than I already do. Happy Birthday!", author: "Unknown" },
  { id: 50, category: "Birthday", text: "Happy Birthday to my forever Valentine.", author: "Unknown" },

  // ============ LOVE ============
  { id: 51, category: "Love", text: "Love is not about finding the perfect person, it's about loving the person perfectly.", author: "Unknown" },
  { id: 52, category: "Love", text: "I didn't choose you. My heart did.", author: "Unknown" },
  { id: 53, category: "Love", text: "Being deeply loved by someone gives you strength, loving someone deeply gives you courage.", author: "Lao Tzu" },
  { id: 54, category: "Love", text: "The greatest happiness you can have is knowing that the person you love loves you back.", author: "Unknown" },
  { id: 55, category: "Love", text: "Love is a journey, not a destination.", author: "Unknown" },
  { id: 56, category: "Love", text: "You are my moon, my sun, and all of my stars.", author: "Unknown" },
  { id: 57, category: "Love", text: "Love grows by giving. The love we give away is the only love we keep.", author: "Elbert Hubbard" },
  { id: 58, category: "Love", text: "The best and most beautiful things in this world cannot be seen or heard, but must be felt with the heart.", author: "Helen Keller" },
  { id: 59, category: "Love", text: "Love will find a way through paths where wolves fear to prey.", author: "Lord Byron" },
  { id: 60, category: "Love", text: "Love is like the wind, you can't see it but you can feel it.", author: "Unknown" },
];

// ============ UTILITY FUNCTIONS ============

/**
 * Get all unique categories
 */
function getCategories() {
  return [...new Set(quotes.map(q => q.category))];
}

/**
 * Get quotes by category
 */
function getQuotesByCategory(category) {
  if (category === "all") return quotes;
  return quotes.filter(q => q.category === category);
}

/**
 * Get random quote
 */
function getRandomQuote() {
  return quotes[Math.floor(Math.random() * quotes.length)];
}

/**
 * Search quotes by text
 */
function searchQuotes(query) {
  const lowerQuery = query.toLowerCase();
  return quotes.filter(q => 
    q.text.toLowerCase().includes(lowerQuery) || 
    q.author.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Get quote by ID
 */
function getQuoteById(id) {
  return quotes.find(q => q.id === id);
}
