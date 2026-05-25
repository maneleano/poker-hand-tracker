/* 
  ============================================
  POKER HAND TRACKER - ENHANCED VERSION
  ============================================
  Features:
  - 4-color deck card selector (4 columns by suit)
  - Visual poker table for position selection
  - Player count slider
  - Progressive workflow (Flop → Turn → River)
  - Villain show toggle
  - Auto-closing card selector
*/

/* 
  ============================================
  APPLICATION STATE
  ============================================
*/
const AppState = {
    currentSession: null,
    currentView: 'session',
    filters: {
        date: null,
        position: null
    },
    cardSelector: {
        isOpen: false,
        currentSlot: null,
        selectedCards: new Set(),
        pendingCards: [], // For multi-card selection (flop)
        selectingHoleCards: false, // For selecting both hole cards at once
        holeCardsSelected: 0 // Counter for hole cards
    },
    tableSelection: {
        heroSeat: null,
        villainSeat: null,
        heroPosition: null,
        villainPosition: null
    },
    workflow: {
        flopUnlocked: false,
        turnUnlocked: false,
        riverUnlocked: false
    },
    lastPotSize: 0 // Track last pot size for auto-populate
};

/* 
  ============================================
  CARD DATA - 4 Color Deck
  ============================================
*/
const CARD_DATA = {
    ranks: ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'],
    suits: {
        's': { name: 'spades', symbol: '♠', class: 'spades' },
        'h': { name: 'hearts', symbol: '♥', class: 'hearts' },
        'd': { name: 'diamonds', symbol: '♦', class: 'diamonds' },
        'c': { name: 'clubs', symbol: '♣', class: 'clubs' }
    },
    // Order suits for 4-column layout: Spades, Hearts, Clubs, Diamonds
    suitOrder: ['s', 'h', 'c', 'd']
};

/* 
  ============================================
  DOM ELEMENT REFERENCES
  ============================================
*/

// Navigation
const navButtons = document.querySelectorAll('.nav-btn');

// Session Form
const sessionForm = document.getElementById('session-form');
const sessionDateInput = document.getElementById('session-date');
const sessionPlaceInput = document.getElementById('session-place');
const sessionBuyinInput = document.getElementById('session-buyin');
const sessionTimeInput = document.getElementById('session-time');
const currentSessionDiv = document.getElementById('current-session');
const sessionInfoDiv = document.getElementById('session-info');
const endSessionBtn = document.getElementById('end-session-btn');
const goToTrackBtn = document.getElementById('go-to-track-btn');

// Hand Form
const handForm = document.getElementById('hand-form');
const noSessionAlert = document.getElementById('no-session-alert');
const handNumberInput = document.getElementById('hand-number');

// Player count slider
const numPlayersSlider = document.getElementById('num-players');
const numPlayersValue = document.getElementById('num-players-value');

// Table seats
const tableSeats = document.querySelectorAll('.seat');
const heroPositionInput = document.getElementById('hero-position');
const villainPositionInput = document.getElementById('villain-position');
const villainSeatInput = document.getElementById('villain-seat');

// Card inputs
const heroCard1Input = document.getElementById('hero-card1');
const heroCard2Input = document.getElementById('hero-card2');
const flopCard1Input = document.getElementById('flop-card1');
const flopCard2Input = document.getElementById('flop-card2');
const flopCard3Input = document.getElementById('flop-card3');
const turnCardInput = document.getElementById('turn-card');
const riverCardInput = document.getElementById('river-card');
const villainCard1Input = document.getElementById('villain-card1');
const villainCard2Input = document.getElementById('villain-card2');

// Other inputs
const effectiveStackInput = document.getElementById('effective-stack');
const preflopActionTextarea = document.getElementById('preflop-action');
const preflopPotInput = document.getElementById('preflop-pot');
const flopActionTextarea = document.getElementById('flop-action');
const flopPotInput = document.getElementById('flop-pot');
const turnActionTextarea = document.getElementById('turn-action');
const turnPotInput = document.getElementById('turn-pot');
const riverActionTextarea = document.getElementById('river-action');
const riverPotInput = document.getElementById('river-pot');
const resultSelect = document.getElementById('result');
const amountInput = document.getElementById('amount');
const clearFormBtn = document.getElementById('clear-form-btn');

// Board displays
const turnBoardDisplay = document.getElementById('turn-board-display');
const riverBoardDisplay = document.getElementById('river-board-display');

// Continue buttons
const continueToFlopBtn = document.getElementById('continue-to-flop-btn');
const continueToTurnBtn = document.getElementById('continue-to-turn-btn');
const continueToRiverBtn = document.getElementById('continue-to-river-btn');

// Sections
const flopSection = document.getElementById('flop-section');
const turnSection = document.getElementById('turn-section');
const riverSection = document.getElementById('river-section');

// Villain show toggle
const villainShowToggle = document.getElementById('villain-show-toggle');
const villainCardsSection = document.getElementById('villain-cards-section');

// Card selector modal
const cardSelectorModal = document.getElementById('card-selector-modal');
const cardGrid = document.getElementById('card-grid');
const modalCloseBtn = document.querySelector('.modal-close');

// History
const handsList = document.getElementById('hands-list');
const filterDateInput = document.getElementById('filter-date');
const filterPositionSelect = document.getElementById('filter-position');
const applyFiltersBtn = document.getElementById('apply-filters-btn');
const clearFiltersBtn = document.getElementById('clear-filters-btn');

/* 
  ============================================
  INITIALIZATION
  ============================================
*/
document.addEventListener('DOMContentLoaded', () => {
    console.log('🃏 Enhanced Poker Hand Tracker initialized');
    
    // Force fresh start - clear any existing session
    PokerStorage.endCurrentSession();
    
    initializeApp();
    setupEventListeners();
    loadPlacesAutocomplete();
    // Don't check for existing session - always start fresh
    initializeCardSelector();
});

function initializeApp() {
    const today = new Date().toISOString().split('T')[0];
    sessionDateInput.value = today;
    
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    sessionTimeInput.value = `${hours}:${minutes}`;
}

function setupEventListeners() {
    // Navigation
    navButtons.forEach(btn => {
        btn.addEventListener('click', handleNavigation);
    });
    
    // Session
    sessionForm.addEventListener('submit', handleSessionSubmit);
    endSessionBtn.addEventListener('click', handleEndSession);
    goToTrackBtn.addEventListener('click', () => {
        const trackHandBtn = document.querySelector('[data-view="track"]');
        if (trackHandBtn) {
            trackHandBtn.click();
        }
    });
    
    // Hand form
    handForm.addEventListener('submit', handleHandSubmit);
    clearFormBtn.addEventListener('click', clearHandForm);
    
    // Player count slider
    numPlayersSlider.addEventListener('input', (e) => {
        numPlayersValue.textContent = e.target.value;
    });
    
    // Table seats
    tableSeats.forEach(seat => {
        seat.addEventListener('click', handleSeatSelection);
    });
    
    // Pre-flop action - enable continue button
    preflopActionTextarea.addEventListener('input', (e) => {
        continueToFlopBtn.disabled = e.target.value.trim().length < 3;
    });
    
    // Flop action - enable continue button
    flopActionTextarea.addEventListener('input', (e) => {
        continueToTurnBtn.disabled = e.target.value.trim().length < 3;
    });
    
    // Turn action - enable continue button
    turnActionTextarea.addEventListener('input', (e) => {
        continueToRiverBtn.disabled = e.target.value.trim().length < 3;
    });
    
    // Continue buttons
    continueToFlopBtn.addEventListener('click', () => {
        openFlopSelection();
        scrollToElement(flopSection);
    });
    continueToTurnBtn.addEventListener('click', () => {
        openTurnSelection();
        scrollToElement(turnSection);
    });
    continueToRiverBtn.addEventListener('click', () => {
        openRiverSelection();
        scrollToElement(riverSection);
    });
    
    // Villain show toggle
    villainShowToggle.addEventListener('change', (e) => {
        if (e.target.checked) {
            villainCardsSection.classList.remove('section-hidden');
        } else {
            villainCardsSection.classList.add('section-hidden');
            // Clear villain cards
            villainCard1Input.value = '';
            villainCard2Input.value = '';
            updateCardDisplay('villain-card1', null);
            updateCardDisplay('villain-card2', null);
        }
    });
    
    // Card selector modal
    modalCloseBtn.addEventListener('click', closeCardSelector);
    cardSelectorModal.addEventListener('click', (e) => {
        if (e.target === cardSelectorModal) {
            closeCardSelector();
        }
    });
    
    // Hero cards button - single button for both cards
    const heroCardsBtn = document.getElementById('hero-cards-btn');
    if (heroCardsBtn) {
        heroCardsBtn.addEventListener('click', () => {
            openCardSelector('hero-card1');
        });
    }
    
    // Other card display buttons
    document.querySelectorAll('.card-display:not(#hero-cards-btn)').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const slot = e.currentTarget.dataset.cardSlot;
            openCardSelector(slot);
        });
    });
    
    // Result select - auto-populate amount with last pot size
    resultSelect.addEventListener('change', () => {
        if (resultSelect.value && !amountInput.value && AppState.lastPotSize > 0) {
            amountInput.value = AppState.lastPotSize;
        }
    });
    
    // History
    applyFiltersBtn.addEventListener('click', applyFilters);
    clearFiltersBtn.addEventListener('click', clearFilters);
}

/* 
  ============================================
  CARD SELECTOR - 4 COLOR DECK
  ============================================
*/

function initializeCardSelector() {
    const cards = [];
    
    // Generate cards organized by RANK first (rows), then by SUIT (columns)
    // This creates: As Ah Ac Ad, Ks Kh Kc Kd, Qs Qh Qc Qd, etc.
    CARD_DATA.ranks.forEach(rank => {
        CARD_DATA.suitOrder.forEach(suitKey => {
            const suit = CARD_DATA.suits[suitKey];
            cards.push({
                value: rank + suitKey.toUpperCase(),
                rank: rank,
                suit: suit
            });
        });
    });
    
    cardGrid.innerHTML = cards.map(card => `
        <div class="card-grid-item ${card.suit.class}" data-card="${card.value}">
            <div class="card-rank">${card.rank}</div>
            <div class="card-suit">${card.suit.symbol}</div>
        </div>
    `).join('');
    
    cardGrid.querySelectorAll('.card-grid-item').forEach(item => {
        item.addEventListener('click', handleCardSelection);
    });
}

function openCardSelector(slot) {
    AppState.cardSelector.currentSlot = slot;
    AppState.cardSelector.isOpen = true;
    
    // Check if this is hero cards selection
    if (slot === 'hero-card1') {
        AppState.cardSelector.selectingHoleCards = true;
        AppState.cardSelector.holeCardsSelected = 0;
        AppState.cardSelector.pendingCards = [];
    } else {
        AppState.cardSelector.selectingHoleCards = false;
        AppState.cardSelector.pendingCards = [];
    }
    
    updateSelectedCardsSet();
    updateCardGrid();
    cardSelectorModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCardSelector() {
    AppState.cardSelector.isOpen = false;
    AppState.cardSelector.currentSlot = null;
    AppState.cardSelector.pendingCards = [];
    AppState.cardSelector.selectingHoleCards = false;
    AppState.cardSelector.holeCardsSelected = 0;
    cardSelectorModal.classList.remove('active');
    document.body.style.overflow = '';
}

function updateSelectedCardsSet() {
    AppState.cardSelector.selectedCards.clear();
    
    const cardInputs = [
        heroCard1Input, heroCard2Input,
        flopCard1Input, flopCard2Input, flopCard3Input,
        turnCardInput, riverCardInput,
        villainCard1Input, villainCard2Input
    ];
    
    cardInputs.forEach(input => {
        if (input.value) {
            AppState.cardSelector.selectedCards.add(input.value);
        }
    });
}

function updateCardGrid() {
    cardGrid.querySelectorAll('.card-grid-item').forEach(item => {
        const cardValue = item.dataset.card;
        const currentSlot = AppState.cardSelector.currentSlot;
        const currentInput = document.getElementById(currentSlot);
        
        item.classList.remove('disabled', 'selected');
        
        if (cardValue === currentInput?.value) {
            item.classList.add('selected');
        } else if (AppState.cardSelector.selectedCards.has(cardValue)) {
            item.classList.add('disabled');
        }
    });
}

function handleCardSelection(e) {
    const cardValue = e.currentTarget.dataset.card;
    const currentSlot = AppState.cardSelector.currentSlot;
    
    // Handle flop (3 cards)
    if (currentSlot === 'flop-card1') {
        handleFlopSelection(cardValue);
        return;
    }
    
    // Handle hole cards (select both in same popup)
    if (AppState.cardSelector.selectingHoleCards) {
        handleHoleCardSelection(cardValue);
        return;
    }
    
    // Handle single card selection
    const currentInput = document.getElementById(currentSlot);
    if (!currentInput) return;
    
    // Remove from other slots if already selected
    const allInputs = [
        { id: 'hero-card1', input: heroCard1Input },
        { id: 'hero-card2', input: heroCard2Input },
        { id: 'flop-card1', input: flopCard1Input },
        { id: 'flop-card2', input: flopCard2Input },
        { id: 'flop-card3', input: flopCard3Input },
        { id: 'turn-card', input: turnCardInput },
        { id: 'river-card', input: riverCardInput },
        { id: 'villain-card1', input: villainCard1Input },
        { id: 'villain-card2', input: villainCard2Input }
    ];
    
    allInputs.forEach(({ id, input }) => {
        if (input.value === cardValue && id !== currentSlot) {
            input.value = '';
            updateCardDisplay(id, null);
        }
    });
    
    // Set card
    currentInput.value = cardValue;
    updateCardDisplay(currentSlot, cardValue);
    
    // Auto-close modal after selection
    setTimeout(() => {
        closeCardSelector();
    }, 300);
}

function handleHoleCardSelection(cardValue) {
    // Add to pending cards if not already selected
    if (!AppState.cardSelector.pendingCards.includes(cardValue)) {
        AppState.cardSelector.pendingCards.push(cardValue);
        AppState.cardSelector.holeCardsSelected++;
        
        // Update visual feedback
        updateSelectedCardsSet();
        AppState.cardSelector.selectedCards.add(cardValue);
        updateCardGrid();
        
        // If 2 cards selected, set them and close
        if (AppState.cardSelector.holeCardsSelected === 2) {
            heroCard1Input.value = AppState.cardSelector.pendingCards[0];
            heroCard2Input.value = AppState.cardSelector.pendingCards[1];
            
            // Update the single hero cards button to show both cards
            updateHeroCardsDisplay();
            
            setTimeout(() => {
                closeCardSelector();
                scrollToElement(effectiveStackInput.closest('.form-group'));
            }, 300);
        }
    }
}

function updateHeroCardsDisplay() {
    const button = document.getElementById('hero-cards-btn');
    if (!button) return;
    
    const card1 = heroCard1Input.value;
    const card2 = heroCard2Input.value;
    
    if (card1 && card2) {
        const rank1 = card1[0];
        const suitKey1 = card1[1].toLowerCase();
        const suit1 = CARD_DATA.suits[suitKey1];
        
        const rank2 = card2[0];
        const suitKey2 = card2[1].toLowerCase();
        const suit2 = CARD_DATA.suits[suitKey2];
        
        button.classList.add('has-card');
        button.innerHTML = `
            <span class="card-value ${suit1.class}">${rank1}${suit1.symbol}</span>
            <span class="card-value ${suit2.class}">${rank2}${suit2.symbol}</span>
        `;
    } else {
        button.classList.remove('has-card');
        button.innerHTML = '<span class="card-placeholder">Select Cards</span>';
    }
}

function handleFlopSelection(cardValue) {
    // Add to pending cards
    if (!AppState.cardSelector.pendingCards.includes(cardValue)) {
        AppState.cardSelector.pendingCards.push(cardValue);
        
        // Update visual feedback
        updateSelectedCardsSet();
        AppState.cardSelector.selectedCards.add(cardValue);
        updateCardGrid();
        
        // If 3 cards selected, set them and close
        if (AppState.cardSelector.pendingCards.length === 3) {
            flopCard1Input.value = AppState.cardSelector.pendingCards[0];
            flopCard2Input.value = AppState.cardSelector.pendingCards[1];
            flopCard3Input.value = AppState.cardSelector.pendingCards[2];
            
            updateCardDisplay('flop-card1', AppState.cardSelector.pendingCards[0]);
            updateCardDisplay('flop-card2', AppState.cardSelector.pendingCards[1]);
            updateCardDisplay('flop-card3', AppState.cardSelector.pendingCards[2]);
            
            setTimeout(() => {
                closeCardSelector();
                // Show flop section
                flopSection.classList.remove('section-hidden');
            }, 300);
        }
    }
}

function updateCardDisplay(slot, cardValue) {
    // Special handling for hero cards - use the combined display
    if (slot === 'hero-card1' || slot === 'hero-card2') {
        updateHeroCardsDisplay();
        return;
    }
    
    const button = document.querySelector(`[data-card-slot="${slot}"]`);
    if (!button) return;
    
    if (cardValue) {
        const rank = cardValue[0];
        const suitKey = cardValue[1].toLowerCase();
        const suit = CARD_DATA.suits[suitKey];
        
        button.classList.add('has-card', suit.class);
        button.innerHTML = `<span class="card-value">${rank}${suit.symbol}</span>`;
    } else {
        button.className = button.className.split(' ').filter(c =>
            c === 'card-display' || c === 'card-display-small'
        ).join(' ');
        
        const placeholder = slot.includes('flop') ? 'Card ' + slot.slice(-1) :
                           slot.includes('turn') ? 'Turn Card' :
                           slot.includes('river') ? 'River Card' :
                           slot.includes('villain') ? 'Card ' + slot.slice(-1) :
                           'Select Card';
        
        button.innerHTML = `<span class="card-placeholder">${placeholder}</span>`;
    }
}

/* 
  ============================================
  PROGRESSIVE WORKFLOW
  ============================================
*/

function openFlopSelection() {
    openCardSelector('flop-card1');
}

function openTurnSelection() {
    // Update turn board display with flop cards
    updateBoardDisplay(turnBoardDisplay, [
        flopCard1Input.value,
        flopCard2Input.value,
        flopCard3Input.value
    ]);
    
    // Show turn section
    turnSection.classList.remove('section-hidden');
    
    openCardSelector('turn-card');
}

function openRiverSelection() {
    // Update river board display with flop + turn cards
    updateBoardDisplay(riverBoardDisplay, [
        flopCard1Input.value,
        flopCard2Input.value,
        flopCard3Input.value,
        turnCardInput.value
    ]);
    
    // Show river section
    riverSection.classList.remove('section-hidden');
    
    openCardSelector('river-card');
}

/**
 * Update board display with cards
 */
function updateBoardDisplay(displayElement, cards) {
    if (!displayElement) return;
    
    const validCards = cards.filter(c => c);
    if (validCards.length === 0) {
        displayElement.innerHTML = '<span style="color: var(--text-secondary);">No cards yet</span>';
        return;
    }
    
    displayElement.innerHTML = validCards.map(cardValue => {
        const rank = cardValue[0];
        const suitKey = cardValue[1].toLowerCase();
        const suit = CARD_DATA.suits[suitKey];
        
        return `<div class="board-card ${suit.class}">${rank}${suit.symbol}</div>`;
    }).join('');
}

/**
 * Scroll to element smoothly
 */
function scrollToElement(element) {
    if (!element) return;
    
    setTimeout(() => {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }, 100);
}

/* 
  ============================================
  TABLE POSITION SELECTION
  ============================================
*/

function handleSeatSelection(e) {
    const seat = e.currentTarget;
    const seatNumber = seat.dataset.seat;
    const position = seat.dataset.position;
    
    // First tap = Hero
    if (!AppState.tableSelection.heroSeat) {
        AppState.tableSelection.heroSeat = seatNumber;
        AppState.tableSelection.heroPosition = position;
        
        // Update UI
        tableSeats.forEach(s => s.classList.remove('hero'));
        seat.classList.add('hero');
        
        // Set hidden input
        heroPositionInput.value = position;
        
        showNotification(`Hero position: ${position}`, 'success');
        scrollToElement(effectiveStackInput.closest('.form-group'));
    }
    // Second tap = Villain
    else if (!AppState.tableSelection.villainSeat && seatNumber !== AppState.tableSelection.heroSeat) {
        AppState.tableSelection.villainSeat = seatNumber;
        AppState.tableSelection.villainPosition = position;
        
        // Update UI
        tableSeats.forEach(s => s.classList.remove('villain'));
        seat.classList.add('villain');
        
        // Set hidden inputs
        villainPositionInput.value = position;
        villainSeatInput.value = seatNumber;
        
        showNotification(`Villain position: ${position}`, 'success');
        scrollToElement(preflopActionTextarea.closest('.form-group'));
    }
    // Third+ tap = Additional players (mark as active)
    else if (seatNumber !== AppState.tableSelection.heroSeat && seatNumber !== AppState.tableSelection.villainSeat) {
        // Toggle active state for additional players
        if (seat.classList.contains('active')) {
            seat.classList.remove('active');
        } else {
            seat.classList.add('active');
        }
    }
    // Reset if clicking same seat
    else if (seatNumber === AppState.tableSelection.heroSeat || seatNumber === AppState.tableSelection.villainSeat) {
        if (seatNumber === AppState.tableSelection.heroSeat) {
            AppState.tableSelection.heroSeat = null;
            AppState.tableSelection.heroPosition = null;
            seat.classList.remove('hero');
            heroPositionInput.value = '';
        } else {
            AppState.tableSelection.villainSeat = null;
            AppState.tableSelection.villainPosition = null;
            seat.classList.remove('villain');
            villainPositionInput.value = '';
            villainSeatInput.value = '';
        }
    }
}

function resetTableSelection() {
    AppState.tableSelection = {
        heroSeat: null,
        villainSeat: null,
        heroPosition: null,
        villainPosition: null
    };
    
    tableSeats.forEach(s => {
        s.classList.remove('hero', 'villain');
    });
    
    heroPositionInput.value = '';
    villainPositionInput.value = '';
    villainSeatInput.value = '';
}

/* 
  ============================================
  SESSION MANAGEMENT
  ============================================
*/

function checkExistingSession() {
    const session = PokerStorage.getCurrentSession();
    
    if (session) {
        AppState.currentSession = session;
        displayCurrentSession(session);
        enableHandTracking();
    }
}

function handleSessionSubmit(e) {
    e.preventDefault();
    
    const session = {
        id: `session_${Date.now()}`,
        date: sessionDateInput.value,
        place: sessionPlaceInput.value,
        buyIn: parseFloat(sessionBuyinInput.value),
        startTime: sessionTimeInput.value,
        endTime: null,
        totalHands: 0
    };
    
    if (PokerStorage.saveCurrentSession(session)) {
        AppState.currentSession = session;
        PokerStorage.savePlace(session.place);
        displayCurrentSession(session);
        enableHandTracking();
        showNotification('Session started successfully! 🎉', 'success');
        
        // Auto-navigate to Track Hand tab
        setTimeout(() => {
            const trackHandBtn = document.querySelector('[data-view="track-hand"]');
            if (trackHandBtn) {
                trackHandBtn.click();
            }
        }, 500);
    } else {
        showNotification('Error starting session', 'error');
    }
}

function displayCurrentSession(session) {
    sessionForm.style.display = 'none';
    currentSessionDiv.style.display = 'block';
    
    sessionInfoDiv.innerHTML = `
        <p><strong>Date:</strong> ${session.date}</p>
        <p><strong>Place:</strong> ${session.place}</p>
        <p><strong>Buy-in:</strong> $${session.buyIn}</p>
        <p><strong>Start Time:</strong> ${session.startTime}</p>
        <p><strong>Hands Played:</strong> ${PokerStorage.getHandsBySession(session.id).length}</p>
    `;
}

function enableHandTracking() {
    noSessionAlert.style.display = 'none';
    handForm.style.display = 'block';
    
    if (AppState.currentSession) {
        const nextHandNum = PokerStorage.getNextHandNumber(AppState.currentSession.id);
        handNumberInput.value = nextHandNum;
    }
}

function handleEndSession() {
    if (confirm('Are you sure you want to end this session?')) {
        PokerStorage.endCurrentSession();
        AppState.currentSession = null;
        
        sessionForm.style.display = 'block';
        currentSessionDiv.style.display = 'none';
        handForm.style.display = 'none';
        noSessionAlert.style.display = 'block';
        
        sessionForm.reset();
        initializeApp();
        
        showNotification('Session ended', 'success');
    }
}

/* 
  ============================================
  HAND TRACKING
  ============================================
*/

function handleHandSubmit(e) {
    e.preventDefault();
    
    if (!AppState.currentSession) {
        showNotification('No active session!', 'error');
        return;
    }
    
    // Track last pot size for auto-populate
    const lastPot = riverPotInput?.value || turnPotInput?.value || flopPotInput?.value || preflopPotInput?.value;
    if (lastPot) {
        AppState.lastPotSize = parseFloat(lastPot);
    }
    
    const hand = {
        id: `hand_${Date.now()}`,
        sessionId: AppState.currentSession.id,
        handNumber: parseInt(handNumberInput.value),
        heroCards: [heroCard1Input.value, heroCard2Input.value],
        boardCards: {
            flop: [flopCard1Input.value, flopCard2Input.value, flopCard3Input.value].filter(c => c),
            turn: turnCardInput.value || null,
            river: riverCardInput.value || null
        },
        numberOfPlayers: parseInt(numPlayersSlider.value),
        effectiveStack: parseFloat(effectiveStackInput.value),
        position: heroPositionInput.value,
        villain: {
            position: villainPositionInput.value || null,
            seat: villainSeatInput.value || null
        },
        actions: {
            preflop: preflopActionTextarea.value.trim(),
            flop: flopActionTextarea.value.trim(),
            turn: turnActionTextarea.value.trim(),
            river: riverActionTextarea.value.trim()
        },
        pots: {
            preflop: preflopPotInput?.value ? parseFloat(preflopPotInput.value) : null,
            flop: flopPotInput?.value ? parseFloat(flopPotInput.value) : null,
            turn: turnPotInput?.value ? parseFloat(turnPotInput.value) : null,
            river: riverPotInput?.value ? parseFloat(riverPotInput.value) : null
        },
        villainCards: villainCard1Input.value && villainCard2Input.value ?
            [villainCard1Input.value, villainCard2Input.value] : null,
        result: resultSelect.value,
        amount: parseFloat(amountInput.value),
        timestamp: new Date().toISOString()
    };
    
    if (!validateHand(hand)) {
        return;
    }
    
    if (PokerStorage.saveHand(hand)) {
        showNotification('Hand saved! 🎴', 'success');
        displayCurrentSession(AppState.currentSession);
        clearHandForm();
        handNumberInput.value = PokerStorage.getNextHandNumber(AppState.currentSession.id);
        
        // Auto-populate amount with last pot size
        if (AppState.lastPotSize > 0) {
            amountInput.value = AppState.lastPotSize;
        }
    } else {
        showNotification('Error saving hand', 'error');
    }
}

function validateHand(hand) {
    if (!hand.heroCards[0] || !hand.heroCards[1]) {
        showNotification('Please select your hole cards', 'error');
        return false;
    }
    
    if (!hand.position) {
        showNotification('Please select your position on the table', 'error');
        return false;
    }
    
    return true;
}

function clearHandForm() {
    // Clear cards
    const allCardInputs = [
        heroCard1Input, heroCard2Input,
        flopCard1Input, flopCard2Input, flopCard3Input,
        turnCardInput, riverCardInput,
        villainCard1Input, villainCard2Input
    ];
    
    allCardInputs.forEach(input => {
        input.value = '';
        updateCardDisplay(input.id, null);
    });
    
    // Reset other inputs
    numPlayersSlider.value = '6';
    numPlayersValue.textContent = '6';
    effectiveStackInput.value = '';
    preflopActionTextarea.value = '';
    if (preflopPotInput) preflopPotInput.value = '';
    flopActionTextarea.value = '';
    if (flopPotInput) flopPotInput.value = '';
    turnActionTextarea.value = '';
    if (turnPotInput) turnPotInput.value = '';
    riverActionTextarea.value = '';
    if (riverPotInput) riverPotInput.value = '';
    resultSelect.value = '';
    amountInput.value = '';
    
    // Clear board displays
    if (turnBoardDisplay) turnBoardDisplay.innerHTML = '';
    if (riverBoardDisplay) riverBoardDisplay.innerHTML = '';
    
    // Reset table selection (including active players)
    tableSeats.forEach(s => {
        s.classList.remove('hero', 'villain', 'active');
    });
    AppState.tableSelection = {
        heroSeat: null,
        villainSeat: null,
        heroPosition: null,
        villainPosition: null
    };
    heroPositionInput.value = '';
    villainPositionInput.value = '';
    villainSeatInput.value = '';
    
    // Hide sections
    flopSection.classList.add('section-hidden');
    turnSection.classList.add('section-hidden');
    riverSection.classList.add('section-hidden');
    villainCardsSection.classList.add('section-hidden');
    
    // Reset continue buttons
    continueToFlopBtn.disabled = true;
    continueToTurnBtn.disabled = true;
    continueToRiverBtn.disabled = true;
    
    // Reset villain toggle
    villainShowToggle.checked = false;
    
    // Clear state
    AppState.cardSelector.selectedCards.clear();
    AppState.workflow = {
        flopUnlocked: false,
        turnUnlocked: false,
        riverUnlocked: false
    };
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* 
  ============================================
  NAVIGATION
  ============================================
*/

function handleNavigation(e) {
    const targetView = e.target.dataset.view;
    
    navButtons.forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    
    document.querySelectorAll('.view').forEach(view => view.classList.remove('active'));
    
    const viewElement = document.getElementById(`${targetView}-view`);
    if (viewElement) {
        viewElement.classList.add('active');
        AppState.currentView = targetView;
        
        if (targetView === 'history') {
            loadHandsHistory();
        }
    }
}

/* 
  ============================================
  HAND HISTORY
  ============================================
*/

function loadHandsHistory() {
    let hands = PokerStorage.getAllHands();
    
    if (AppState.filters.date) {
        hands = hands.filter(hand => {
            const session = PokerStorage.getAllSessions().find(s => s.id === hand.sessionId);
            return session && session.date === AppState.filters.date;
        });
    }
    
    if (AppState.filters.position) {
        hands = hands.filter(hand => hand.position === AppState.filters.position);
    }
    
    hands.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    displayHands(hands);
}

function displayHands(hands) {
    if (hands.length === 0) {
        handsList.innerHTML = '<p class="empty-state">No hands found.</p>';
        return;
    }
    
    const handsHTML = hands.map(hand => {
        const session = PokerStorage.getAllSessions().find(s => s.id === hand.sessionId);
        const amountClass = hand.amount >= 0 ? 'positive' : 'negative';
        const resultClass = hand.result;
        const amountSign = hand.amount >= 0 ? '+' : '';
        
        let boardDisplay = '';
        if (hand.boardCards) {
            if (hand.boardCards.flop && hand.boardCards.flop.length > 0) {
                boardDisplay += `<div><strong>Flop:</strong> ${hand.boardCards.flop.join(' ')}</div>`;
            }
            if (hand.boardCards.turn) {
                boardDisplay += `<div><strong>Turn:</strong> ${hand.boardCards.turn}</div>`;
            }
            if (hand.boardCards.river) {
                boardDisplay += `<div><strong>River:</strong> ${hand.boardCards.river}</div>`;
            }
        }
        
        return `
            <div class="hand-card ${resultClass}" data-hand-id="${hand.id}">
                <div class="hand-card-header">
                    <span class="hand-card-title">
                        Hand #${hand.handNumber} - ${hand.heroCards.join(' ')}
                    </span>
                    <span class="hand-card-amount ${amountClass}">
                        ${amountSign}$${hand.amount.toFixed(2)}
                    </span>
                </div>
                <div class="hand-card-details">
                    <div><strong>Date:</strong> ${session ? session.date : 'Unknown'}</div>
                    <div><strong>Position:</strong> ${hand.position}</div>
                    <div><strong>Players:</strong> ${hand.numberOfPlayers}</div>
                    ${boardDisplay}
                    <div><strong>Result:</strong> ${hand.result.toUpperCase()}</div>
                    ${hand.villainCards ? `<div><strong>Villain:</strong> ${hand.villainCards.join(' ')}</div>` : ''}
                </div>
            </div>
        `;
    }).join('');
    
    handsList.innerHTML = handsHTML;
    
    document.querySelectorAll('.hand-card').forEach(card => {
        card.addEventListener('click', () => {
            const handId = card.dataset.handId;
            showHandDetails(handId);
        });
    });
}

function showHandDetails(handId) {
    const hand = PokerStorage.getHandById(handId);
    if (!hand) return;
    
    const session = PokerStorage.getAllSessions().find(s => s.id === hand.sessionId);
    
    let boardInfo = '';
    if (hand.boardCards) {
        if (hand.boardCards.flop && hand.boardCards.flop.length > 0) {
            boardInfo += `Flop: ${hand.boardCards.flop.join(' ')}\n`;
        }
        if (hand.boardCards.turn) {
            boardInfo += `Turn: ${hand.boardCards.turn}\n`;
        }
        if (hand.boardCards.river) {
            boardInfo += `River: ${hand.boardCards.river}\n`;
        }
    }
    
    const details = `
Hand #${hand.handNumber}
Date: ${session ? session.date : 'Unknown'}
Place: ${session ? session.place : 'Unknown'}

Your Cards: ${hand.heroCards.join(' ')}
Position: ${hand.position}
Players: ${hand.numberOfPlayers}
Stack: $${hand.effectiveStack}

${boardInfo}
Villain: ${hand.villain.position || 'Unknown'}
${hand.villainCards ? `Villain Cards: ${hand.villainCards.join(' ')}` : ''}

Pre-Flop: ${hand.actions.preflop || 'N/A'}
Flop: ${hand.actions.flop || 'N/A'}
Turn: ${hand.actions.turn || 'N/A'}
River: ${hand.actions.river || 'N/A'}

Result: ${hand.result.toUpperCase()}
Amount: ${hand.amount >= 0 ? '+' : ''}$${hand.amount.toFixed(2)}
    `.trim();
    
    alert(details);
}

function applyFilters() {
    AppState.filters.date = filterDateInput.value || null;
    AppState.filters.position = filterPositionSelect.value || null;
    
    loadHandsHistory();
    showNotification('Filters applied', 'success');
}

function clearFilters() {
    filterDateInput.value = '';
    filterPositionSelect.value = '';
    AppState.filters.date = null;
    AppState.filters.position = null;
    
    loadHandsHistory();
    showNotification('Filters cleared', 'success');
}

/* 
  ============================================
  UTILITIES
  ============================================
*/

function loadPlacesAutocomplete() {
    const places = PokerStorage.getAllPlaces();
    const datalist = document.getElementById('places-list');
    
    datalist.innerHTML = '';
    places.forEach(place => {
        const option = document.createElement('option');
        option.value = place;
        datalist.appendChild(option);
    });
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        left: 50%;
        transform: translateX(-50%);
        background-color: ${type === 'success' ? '#2ecc71' : '#e74c3c'};
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        z-index: 1000;
        animation: fadeIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

/* 
  ============================================
  ENHANCEMENTS SUMMARY
  ============================================
  
  ✅ 4-color deck (spades black, hearts red, clubs green, diamonds blue)
  ✅ 4-column card grid (one column per suit)
  ✅ Player count slider (2-9)
  ✅ Visual poker table for position selection
  ✅ Progressive workflow (Continue buttons unlock next street)
  ✅ Auto-closing card selector after selection
  ✅ Villain show toggle
  ✅ Hand number auto-increment
  ✅ All enhancements requested implemented!
*/

// Made with Bob

