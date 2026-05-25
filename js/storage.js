/* 
  ============================================
  STORAGE MODULE
  ============================================
  This module handles all data persistence using Local Storage.
  
  LEARNING: Module Pattern
  - We create an object (PokerStorage) with methods
  - This organizes related functions together
  - Makes code reusable and maintainable
*/

const PokerStorage = {
    
    /* 
      ============================================
      STORAGE KEYS
      ============================================
      Constants for localStorage keys.
      Using constants prevents typos and makes changes easier.
    */
    KEYS: {
        CURRENT_SESSION: 'poker_current_session',
        SESSIONS: 'poker_sessions',
        HANDS: 'poker_hands',
        PLACES: 'poker_places',  // Remember previous places for autocomplete
        SETTINGS: 'poker_settings'
    },

    /* 
      ============================================
      SESSION MANAGEMENT
      ============================================
    */
    
    /**
     * Save the current active session
     * @param {Object} session - Session data object
     * 
     * LEARNING: Function parameters
     * - Functions can accept inputs (parameters)
     * - We document what type of data is expected
     */
    saveCurrentSession(session) {
        try {
            /* 
              LEARNING: JSON.stringify()
              - Converts JavaScript objects to JSON strings
              - Local Storage only stores strings, not objects
              - JSON (JavaScript Object Notation) is a text format for data
              
              Example:
              Object: { name: "John", age: 30 }
              JSON: '{"name":"John","age":30}'
            */
            localStorage.setItem(this.KEYS.CURRENT_SESSION, JSON.stringify(session));
            
            // Also save to sessions history
            this.addSessionToHistory(session);
            
            return true;
        } catch (error) {
            /* 
              LEARNING: Error Handling
              - try/catch blocks handle errors gracefully
              - If code in 'try' fails, 'catch' runs instead
              - Prevents app from crashing
            */
            console.error('Error saving session:', error);
            return false;
        }
    },

    /**
     * Get the current active session
     * @returns {Object|null} Session object or null if none exists
     * 
     * LEARNING: Return values
     * - Functions can return data back to the caller
     * - null means "no value" (different from undefined)
     */
    getCurrentSession() {
        try {
            const sessionData = localStorage.getItem(this.KEYS.CURRENT_SESSION);
            
            /* 
              LEARNING: Conditional (if) statement
              - Checks if condition is true
              - ! means "not" (so !sessionData means "if no session data")
              - return exits the function early
            */
            if (!sessionData) {
                return null;
            }
            
            /* 
              LEARNING: JSON.parse()
              - Converts JSON strings back to JavaScript objects
              - Opposite of JSON.stringify()
            */
            return JSON.parse(sessionData);
        } catch (error) {
            console.error('Error getting session:', error);
            return null;
        }
    },

    /**
     * End the current session
     */
    endCurrentSession() {
        try {
            /* 
              LEARNING: localStorage.removeItem()
              - Deletes a specific item from storage
              - Like removing a file from the filing cabinet
            */
            localStorage.removeItem(this.KEYS.CURRENT_SESSION);
            return true;
        } catch (error) {
            console.error('Error ending session:', error);
            return false;
        }
    },

    /**
     * Add session to history
     * @param {Object} session - Session to add
     */
    addSessionToHistory(session) {
        try {
            /* 
              LEARNING: Getting existing data
              - First, get what's already stored
              - If nothing exists, use empty array []
              - || means "or" (if left side is falsy, use right side)
            */
            const sessions = this.getAllSessions() || [];
            
            /* 
              LEARNING: Array methods
              - Arrays are ordered lists of items
              - .find() searches for an item matching a condition
              - Arrow function: (item) => condition
            */
            const existingIndex = sessions.findIndex(s => s.id === session.id);
            
            if (existingIndex >= 0) {
                // Update existing session
                sessions[existingIndex] = session;
            } else {
                // Add new session
                /* 
                  LEARNING: .push()
                  - Adds item to end of array
                  - Modifies the original array
                */
                sessions.push(session);
            }
            
            localStorage.setItem(this.KEYS.SESSIONS, JSON.stringify(sessions));
        } catch (error) {
            console.error('Error adding session to history:', error);
        }
    },

    /**
     * Get all sessions
     * @returns {Array} Array of session objects
     */
    getAllSessions() {
        try {
            const sessionsData = localStorage.getItem(this.KEYS.SESSIONS);
            return sessionsData ? JSON.parse(sessionsData) : [];
        } catch (error) {
            console.error('Error getting sessions:', error);
            return [];
        }
    },

    /* 
      ============================================
      HAND MANAGEMENT
      ============================================
    */

    /**
     * Save a poker hand
     * @param {Object} hand - Hand data object
     * @returns {boolean} Success status
     */
    saveHand(hand) {
        try {
            const hands = this.getAllHands();
            
            /* 
              LEARNING: Object property access
              - Dot notation: hand.id
              - Bracket notation: hand['id']
              - Both do the same thing
            */
            const existingIndex = hands.findIndex(h => h.id === hand.id);
            
            if (existingIndex >= 0) {
                hands[existingIndex] = hand;
            } else {
                hands.push(hand);
            }
            
            localStorage.setItem(this.KEYS.HANDS, JSON.stringify(hands));
            return true;
        } catch (error) {
            console.error('Error saving hand:', error);
            return false;
        }
    },

    /**
     * Get all hands
     * @returns {Array} Array of hand objects
     */
    getAllHands() {
        try {
            const handsData = localStorage.getItem(this.KEYS.HANDS);
            return handsData ? JSON.parse(handsData) : [];
        } catch (error) {
            console.error('Error getting hands:', error);
            return [];
        }
    },

    /**
     * Get hands for a specific session
     * @param {string} sessionId - Session ID to filter by
     * @returns {Array} Array of hand objects
     */
    getHandsBySession(sessionId) {
        try {
            const allHands = this.getAllHands();
            
            /* 
              LEARNING: .filter()
              - Creates new array with items that pass a test
              - Doesn't modify original array
              - Returns all items where condition is true
              
              Example:
              [1, 2, 3, 4].filter(n => n > 2)  // Returns [3, 4]
            */
            return allHands.filter(hand => hand.sessionId === sessionId);
        } catch (error) {
            console.error('Error getting hands by session:', error);
            return [];
        }
    },

    /**
     * Get a specific hand by ID
     * @param {string} handId - Hand ID
     * @returns {Object|null} Hand object or null
     */
    getHandById(handId) {
        try {
            const hands = this.getAllHands();
            
            /* 
              LEARNING: .find()
              - Returns first item that matches condition
              - Returns undefined if nothing matches
              - Stops searching after first match (efficient)
            */
            return hands.find(hand => hand.id === handId) || null;
        } catch (error) {
            console.error('Error getting hand:', error);
            return null;
        }
    },

    /**
     * Delete a hand
     * @param {string} handId - Hand ID to delete
     * @returns {boolean} Success status
     */
    deleteHand(handId) {
        try {
            const hands = this.getAllHands();
            
            /* 
              LEARNING: .filter() for deletion
              - Keep all hands EXCEPT the one we want to delete
              - !== means "not equal to"
              - Creates new array without the deleted item
            */
            const updatedHands = hands.filter(hand => hand.id !== handId);
            
            localStorage.setItem(this.KEYS.HANDS, JSON.stringify(updatedHands));
            return true;
        } catch (error) {
            console.error('Error deleting hand:', error);
            return false;
        }
    },

    /**
     * Get next hand number for current session
     * @param {string} sessionId - Current session ID
     * @returns {number} Next hand number
     */
    getNextHandNumber(sessionId) {
        try {
            const sessionHands = this.getHandsBySession(sessionId);
            
            /* 
              LEARNING: Array length
              - .length property tells us how many items in array
              - Arrays are zero-indexed (first item is [0])
              - So length is always count of items
            */
            return sessionHands.length + 1;
        } catch (error) {
            console.error('Error getting next hand number:', error);
            return 1;
        }
    },

    /* 
      ============================================
      PLACES MANAGEMENT (for autocomplete)
      ============================================
    */

    /**
     * Save a place to the places list
     * @param {string} place - Place name
     */
    savePlace(place) {
        try {
            if (!place || place.trim() === '') return;
            
            const places = this.getAllPlaces();
            
            /* 
              LEARNING: .includes()
              - Checks if array contains a specific value
              - Returns true or false
              - Case-sensitive by default
            */
            if (!places.includes(place)) {
                places.push(place);
                localStorage.setItem(this.KEYS.PLACES, JSON.stringify(places));
            }
        } catch (error) {
            console.error('Error saving place:', error);
        }
    },

    /**
     * Get all saved places
     * @returns {Array} Array of place names
     */
    getAllPlaces() {
        try {
            const placesData = localStorage.getItem(this.KEYS.PLACES);
            return placesData ? JSON.parse(placesData) : [];
        } catch (error) {
            console.error('Error getting places:', error);
            return [];
        }
    },

    /* 
      ============================================
      STATISTICS & ANALYSIS
      ============================================
    */

    /**
     * Get statistics for all hands
     * @returns {Object} Statistics object
     */
    getStatistics() {
        try {
            const hands = this.getAllHands();
            
            /* 
              LEARNING: Object creation
              - Objects store key-value pairs
              - Like a dictionary or map
              - Access with dot notation: stats.totalHands
            */
            const stats = {
                totalHands: hands.length,
                totalWins: 0,
                totalLosses: 0,
                totalSplits: 0,
                totalProfit: 0,
                winRate: 0,
                profitByPosition: {},
                mostProfitableHand: null
            };
            
            /* 
              LEARNING: for...of loop
              - Iterates through each item in array
              - 'hand' is the current item in each iteration
              - Cleaner than traditional for loop
            */
            for (const hand of hands) {
                // Count results
                if (hand.result === 'win') stats.totalWins++;
                if (hand.result === 'loss') stats.totalLosses++;
                if (hand.result === 'split') stats.totalSplits++;
                
                // Sum profit/loss
                /* 
                  LEARNING: += operator
                  - Shorthand for: stats.totalProfit = stats.totalProfit + hand.amount
                  - Adds value to existing value
                */
                stats.totalProfit += hand.amount || 0;
                
                // Track profit by position
                if (!stats.profitByPosition[hand.position]) {
                    stats.profitByPosition[hand.position] = 0;
                }
                stats.profitByPosition[hand.position] += hand.amount || 0;
            }
            
            // Calculate win rate
            /* 
              LEARNING: Ternary operator
              - Shorthand if/else: condition ? valueIfTrue : valueIfFalse
              - Prevents division by zero
            */
            stats.winRate = stats.totalHands > 0 
                ? (stats.totalWins / stats.totalHands * 100).toFixed(2)
                : 0;
            
            return stats;
        } catch (error) {
            console.error('Error calculating statistics:', error);
            return null;
        }
    },

    /* 
      ============================================
      UTILITY FUNCTIONS
      ============================================
    */

    /**
     * Clear all data (use with caution!)
     * @returns {boolean} Success status
     */
    clearAllData() {
        try {
            /* 
              LEARNING: Confirmation dialog
              - window.confirm() shows a yes/no dialog
              - Returns true if user clicks OK, false if Cancel
              - Good for destructive actions
            */
            if (confirm('Are you sure you want to delete all data? This cannot be undone.')) {
                localStorage.removeItem(this.KEYS.CURRENT_SESSION);
                localStorage.removeItem(this.KEYS.SESSIONS);
                localStorage.removeItem(this.KEYS.HANDS);
                localStorage.removeItem(this.KEYS.PLACES);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error clearing data:', error);
            return false;
        }
    },

    /**
     * Export all data as JSON (for backup or migration)
     * @returns {Object} All data
     */
    exportData() {
        try {
            /* 
              LEARNING: Object literal
              - Creating an object with multiple properties
              - Property shorthand: { sessions } is same as { sessions: sessions }
            */
            return {
                sessions: this.getAllSessions(),
                hands: this.getAllHands(),
                places: this.getAllPlaces(),
                exportDate: new Date().toISOString()
            };
        } catch (error) {
            console.error('Error exporting data:', error);
            return null;
        }
    },

    /**
     * Import data from JSON (for restore or migration)
     * @param {Object} data - Data object to import
     * @returns {boolean} Success status
     */
    importData(data) {
        try {
            if (data.sessions) {
                localStorage.setItem(this.KEYS.SESSIONS, JSON.stringify(data.sessions));
            }
            if (data.hands) {
                localStorage.setItem(this.KEYS.HANDS, JSON.stringify(data.hands));
            }
            if (data.places) {
                localStorage.setItem(this.KEYS.PLACES, JSON.stringify(data.places));
            }
            return true;
        } catch (error) {
            console.error('Error importing data:', error);
            return false;
        }
    }
};

/* 
  ============================================
  LEARNING SUMMARY: What we covered
  ============================================
  
  1. MODULE PATTERN: Organizing related functions in an object
  2. LOCAL STORAGE: Browser's built-in storage system
  3. JSON: Converting between objects and strings
  4. ARRAYS: Lists of items with useful methods (.push, .filter, .find)
  5. OBJECTS: Key-value pairs for structured data
  6. ERROR HANDLING: try/catch blocks for graceful failures
  7. FUNCTIONS: Reusable blocks of code with parameters and return values
  8. CONDITIONALS: if statements and ternary operators
  9. LOOPS: for...of for iterating through arrays
  10. OPERATORS: +=, ||, ===, !==, etc.
  
  Next, we'll create the main app.js file that uses this storage module
  to make the UI interactive!
*/

// Made with Bob
