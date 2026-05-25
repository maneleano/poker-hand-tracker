# 🃏 Poker Hand Tracker - User Guide & Documentation

## Table of Contents
1. [Overview](#overview)
2. [Getting Started](#getting-started)
3. [How to Use](#how-to-use)
4. [Understanding the Code](#understanding-the-code)
5. [Data Storage](#data-storage)
6. [Future Enhancements](#future-enhancements)
7. [Troubleshooting](#troubleshooting)

---

## Overview

The Poker Hand Tracker is a mobile-optimized web application designed to help you quickly record and analyze your No Limit Texas Hold'em poker hands. Built with vanilla HTML, CSS, and JavaScript, it's perfect for learning web development fundamentals while solving a real-world problem.

### Key Features
- ✅ **Quick Hand Entry** - Record a hand in under 10 seconds
- ✅ **Session Management** - Track multiple poker sessions
- ✅ **Pre-populated Data** - Date, place, buy-in, and time auto-filled
- ✅ **Comprehensive Tracking** - All relevant hand details captured
- ✅ **Hand History** - Review and filter past hands
- ✅ **Offline Capable** - Works without internet (after initial load)
- ✅ **Mobile Optimized** - Touch-friendly interface

---

## Getting Started

### Opening the App

**Option 1: Double-click**
- Simply double-click `index.html` in the `poker-hand-tracker` folder

**Option 2: From Terminal**
```bash
cd poker-hand-tracker
open index.html  # macOS
```

**Option 3: Live Server (Recommended for Development)**
- If you have VS Code with Live Server extension:
  1. Right-click `index.html`
  2. Select "Open with Live Server"
  3. App opens at `http://localhost:5500`

### First Time Setup
No setup required! The app works immediately. Your data is stored locally in your browser.

---

## How to Use

### 1. Starting a Poker Session

When you open the app, you'll see the **Session** view:

1. **Date** - Pre-filled with today's date (you can change it)
2. **Place** - Enter where you're playing (e.g., "Home Game", "Casino")
   - The app remembers previous places for quick selection
3. **Buy-in** - Enter your buy-in amount in dollars
4. **Start Time** - Pre-filled with current time (you can adjust)
5. Click **"Start Session"**

**What Happens:**
- Session is saved to browser storage
- You can now track hands
- Session info is displayed at the top

**💡 Learning Point:** The form uses HTML5 input types (`date`, `time`, `number`) which provide native mobile keyboards and pickers!

---

### 2. Tracking a Hand

Switch to the **Track Hand** tab:

#### Quick Entry Fields:

**Hand Number** (Auto-filled)
- Automatically increments for each hand
- Read-only (you can't edit it)

**Your Hole Cards** (Required)
- Format: Rank + Suit
- Ranks: A, K, Q, J, T, 2-9
- Suits: s (spades), h (hearts), d (diamonds), c (clubs)
- Example: `As` `Kh` (Ace of spades, King of hearts)
- **Tip:** Type in lowercase, it auto-converts to uppercase!

**Number of Players** (Required)
- Default: 6
- Range: 2-10

**Effective Stack** (Required)
- Your stack size in dollars
- Use decimals if needed (e.g., 95.50)

**Your Position** (Required)
- Select from dropdown:
  - UTG (Under the Gun)
  - UTG+1
  - MP (Middle Position)
  - CO (Cutoff)
  - BTN (Button)
  - SB (Small Blind)
  - BB (Big Blind)

**Villain Position** (Optional)
- Main opponent's position

**Villain Name** (Optional)
- If you know their name

**Action Tracking** (Optional but recommended)
- **Pre-Flop**: e.g., "Raise 3BB, BB calls"
- **Flop**: e.g., "Check, Bet 5BB, Call"
- **Turn**: e.g., "Check, Check"
- **River**: e.g., "Bet 10BB, Fold"

**Villain's Hole Cards** (Optional)
- Only if shown at showdown
- Same format as your cards

**Result** (Required)
- Win, Loss, or Split Pot

**Amount Won/Lost** (Required)
- Positive for wins (e.g., 15)
- Negative for losses (e.g., -10)

**Buttons:**
- **Save Hand** - Saves and clears form for next hand
- **Clear** - Clears form without saving

**💡 Learning Point:** The form uses JavaScript validation to ensure card format is correct before saving!

---

### 3. Viewing Hand History

Switch to the **History** tab:

#### Filtering Options:
- **Date** - Show hands from specific date
- **Position** - Show hands from specific position
- Click **Apply Filters** to filter
- Click **Clear Filters** to show all hands

#### Hand Cards:
Each hand is displayed as a card showing:
- Hand number and your cards
- Win/Loss amount (green for wins, red for losses)
- Date, position, number of players
- Result
- Villain's cards (if available)

**Click any hand card** to see full details including all actions!

**💡 Learning Point:** The history uses JavaScript's `.filter()` and `.sort()` methods to organize data dynamically!

---

### 4. Ending a Session

1. Go back to **Session** tab
2. Click **End Session**
3. Confirm the action
4. Session ends, but hands are saved permanently

You can start a new session anytime!

---

## Understanding the Code

### Project Structure

```
poker-hand-tracker/
├── index.html          # Structure (HTML)
├── css/
│   └── styles.css      # Styling (CSS)
├── js/
│   ├── storage.js      # Data management
│   └── app.js          # User interactions
└── README.md           # This file
```

### How It Works Together

```
┌─────────────┐
│  index.html │  ← Structure: Forms, buttons, containers
└──────┬──────┘
       │
       ├──→ ┌─────────────┐
       │    │ styles.css  │  ← Appearance: Colors, layout, animations
       │    └─────────────┘
       │
       └──→ ┌─────────────┐
            │   app.js    │  ← Behavior: Handles clicks, updates UI
            └──────┬──────┘
                   │
                   └──→ ┌─────────────┐
                        │ storage.js  │  ← Data: Saves/loads from browser
                        └──────┬──────┘
                               │
                               └──→ [Local Storage]
                                    Browser's filing cabinet
```

### Key Concepts Explained

#### 1. **HTML - The Structure**
Think of HTML as the skeleton of a building:
- `<header>` - The roof (navigation)
- `<main>` - The rooms (content areas)
- `<form>` - Data collection points
- `<input>` - Individual data fields

**Example from our code:**
```html
<input type="date" id="session-date" name="date" required>
```
- `type="date"` - Shows date picker on mobile
- `id` - Unique identifier for JavaScript
- `name` - Field name for data collection
- `required` - Must be filled before submission

#### 2. **CSS - The Styling**
CSS is like interior design:
- Colors, fonts, spacing
- Layout (where things go)
- Responsive design (adapts to screen size)
- Animations and transitions

**Example from our code:**
```css
.btn-primary {
    background-color: var(--primary-color);
    color: var(--dark-bg);
}
```
- `.btn-primary` - Selector (which elements to style)
- `background-color` - Property (what to change)
- `var(--primary-color)` - Value (what to change it to)

**CSS Variables:**
We use variables for consistency:
```css
:root {
    --primary-color: #2ecc71;  /* Define once */
}

.button {
    background: var(--primary-color);  /* Use everywhere */
}
```
Change the variable once, updates everywhere!

#### 3. **JavaScript - The Behavior**
JavaScript makes things interactive:
- Responds to clicks, typing, etc.
- Updates the page dynamically
- Saves and loads data
- Validates input

**Example from our code:**
```javascript
sessionForm.addEventListener('submit', handleSessionSubmit);
```
- `addEventListener` - "Listen for an event"
- `'submit'` - The event type (form submission)
- `handleSessionSubmit` - Function to run when event happens

**Functions:**
Functions are reusable blocks of code:
```javascript
function saveHand(hand) {
    // Code to save hand
    return true;  // Return success status
}
```

**Objects:**
Objects store related data:
```javascript
const session = {
    id: 'session_123',
    date: '2026-05-20',
    place: 'Home Game',
    buyIn: 100
};

// Access properties:
console.log(session.date);  // "2026-05-20"
```

**Arrays:**
Arrays are ordered lists:
```javascript
const cards = ['As', 'Kh'];
console.log(cards[0]);  // "As" (first item)
console.log(cards.length);  // 2 (number of items)
```

---

## Data Storage

### How Local Storage Works

**Local Storage** is like a filing cabinet in your browser:
- Stores data as key-value pairs
- Data persists even after closing browser
- Limited to ~5-10MB per website
- Only stores strings (we use JSON for objects)

### What Gets Stored

1. **Current Session** - Active poker session
2. **Sessions History** - All past sessions
3. **Hands** - All recorded hands
4. **Places** - List of places for autocomplete

### Data Format

**Session Object:**
```javascript
{
    id: "session_1716253200000",
    date: "2026-05-20",
    place: "Home Game",
    buyIn: 100,
    startTime: "20:00",
    endTime: null,
    totalHands: 0
}
```

**Hand Object:**
```javascript
{
    id: "hand_1716253500000",
    sessionId: "session_1716253200000",
    handNumber: 1,
    heroCards: ["As", "Kh"],
    numberOfPlayers: 6,
    effectiveStack: 95,
    position: "BTN",
    villain: {
        position: "BB",
        name: "John"
    },
    actions: {
        preflop: "Raise 3BB, BB calls",
        flop: "Check, Bet 5BB, Call",
        turn: "Check, Check",
        river: "Bet 10BB, Fold"
    },
    villainCards: ["Qd", "Jd"],
    result: "win",
    amount: 15,
    timestamp: "2026-05-20T23:18:11.744Z"
}
```

### Viewing Your Data

Open browser console (F12 or Cmd+Option+I) and type:
```javascript
// View all hands
console.log(PokerStorage.getAllHands());

// View current session
console.log(PokerStorage.getCurrentSession());

// View statistics
console.log(PokerStorage.getStatistics());
```

### Exporting Your Data

In browser console:
```javascript
// Export all data
const data = PokerStorage.exportData();
console.log(JSON.stringify(data, null, 2));

// Copy to clipboard
copy(JSON.stringify(data, null, 2));
```

Save this to a text file for backup!

---

## Future Enhancements

### Phase 2: Enhanced Features (Next Steps)

1. **Visual Card Selector**
   - Click cards instead of typing
   - Faster and more intuitive

2. **Statistics Dashboard**
   - Win rate by position
   - Most profitable hands
   - Session summaries
   - Charts and graphs

3. **Export/Import**
   - Download data as JSON
   - Import from backup
   - Share hands with friends

4. **Hand Replayer**
   - Visual representation of hand
   - Step through actions
   - Better for analysis

### Phase 3: Cloud Migration

**Why Cloud?**
- Access from any device
- Automatic backups
- Share with coach/friends
- More storage space

**Recommended Approach:**

1. **Firebase (Google)**
   - Free tier: 1GB storage
   - Real-time sync
   - Easy authentication
   - Good documentation

2. **Supabase (Open Source)**
   - PostgreSQL database
   - Free tier: 500MB
   - More control
   - SQL queries

**Migration Steps:**
1. Keep local storage as fallback
2. Add cloud sync option
3. Sync on save (if online)
4. Pull from cloud on load
5. Conflict resolution (last write wins)

**Code Changes Needed:**
```javascript
// Add to storage.js
async saveHandToCloud(hand) {
    try {
        // Save locally first
        this.saveHand(hand);
        
        // Then sync to cloud
        if (navigator.onLine) {
            await firebase.firestore()
                .collection('hands')
                .doc(hand.id)
                .set(hand);
        }
    } catch (error) {
        console.error('Cloud sync failed:', error);
        // Local save still succeeded
    }
}
```

---

## Troubleshooting

### Common Issues

**1. App doesn't load**
- Check browser console (F12) for errors
- Ensure all files are in correct folders
- Try hard refresh (Cmd+Shift+R or Ctrl+Shift+R)

**2. Data not saving**
- Check if browser allows local storage
- Private/Incognito mode may block storage
- Check browser storage quota

**3. Cards not validating**
- Use correct format: Rank (A,K,Q,J,T,2-9) + Suit (s,h,d,c)
- Examples: As, Kh, Qd, Jc, Ts, 9s, 2h
- Case doesn't matter (auto-converts to uppercase)

**4. Session won't start**
- Ensure all required fields are filled
- Check date format is valid
- Check buy-in is a positive number

**5. Hands not appearing in history**
- Ensure you started a session first
- Check filters aren't hiding hands
- Try clearing filters

### Clearing All Data

If you need to start fresh:

**Option 1: Through Browser**
1. Open Developer Tools (F12)
2. Go to Application tab
3. Find Local Storage
4. Right-click → Clear

**Option 2: Through Console**
```javascript
PokerStorage.clearAllData();
```

**Option 3: Manual**
```javascript
localStorage.clear();
```

---

## Learning Resources

### Want to Learn More?

**HTML:**
- [MDN HTML Guide](https://developer.mozilla.org/en-US/docs/Web/HTML)
- [HTML5 Input Types](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input)

**CSS:**
- [MDN CSS Guide](https://developer.mozilla.org/en-US/docs/Web/CSS)
- [CSS Flexbox](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)
- [CSS Grid](https://css-tricks.com/snippets/css/complete-guide-grid/)

**JavaScript:**
- [MDN JavaScript Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)
- [JavaScript.info](https://javascript.info/)
- [Eloquent JavaScript (Free Book)](https://eloquentjavascript.net/)

**Local Storage:**
- [MDN Local Storage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)

### Practice Exercises

1. **Add a new field** - Try adding "Table Stakes" to session form
2. **Change colors** - Modify CSS variables to create your theme
3. **Add validation** - Prevent duplicate card entries
4. **Create statistics** - Calculate average win per position
5. **Export feature** - Add button to download data as JSON

---

## Credits

Built as a learning project to understand:
- Web development fundamentals
- Mobile-first design
- Data persistence
- User experience design

**Technologies Used:**
- HTML5
- CSS3
- Vanilla JavaScript
- Local Storage API

**No frameworks or libraries** - Pure web fundamentals!

---

## Support

Questions or issues? Check:
1. This README
2. Code comments (every file is heavily documented)
3. Browser console for error messages

---

**Happy Tracking! 🃏♠️♥️♦️♣️**

Remember: The goal isn't just to track hands, but to learn from them!