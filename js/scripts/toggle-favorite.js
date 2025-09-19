// toggle-favorite.js

/**
 * Configuration object for selectors, classes, labels, and storage key
 */
const CONFIG = {
  storageKey: "site:favorites:v1",
  selectors: {
    item: "[data-js-fav-item]",             // each recipe card
    buttonContainer: "[data-js-fav-badge]", // where the favorite button lives
  },
  classes: {
    button: "recipe-card__favorite", // button class
    active: "is-active",             // active state
  },
  labels: {
    add: "Add to favorites",
    remove: "Remove from favorites",
  },
};

/**
 * Class managing favorites state in localStorage
 */
class FavoritesStore {
  constructor(key) {
    this.key = key;
    this.items = new Set(this._load());
  }

  // Load favorites from localStorage
  _load() {
    try {
      return JSON.parse(localStorage.getItem(this.key)) || [];
    } catch {
      return [];
    }
  }

  // Save current favorites to localStorage
  _save() {
    localStorage.setItem(this.key, JSON.stringify([...this.items]));
  }

  // Check if an item is favorited
  has(id) {
    return this.items.has(id);
  }

  // Toggle an item's favorite state and return new state
  toggle(id) {
    if (this.items.has(id)) this.items.delete(id);
    else this.items.add(id);
    this._save();
    return this.items.has(id);
  }
}

// Unique ID generator
let idCounter = 1;
const usedIds = new Set();
function generateUniqueId(prefix = "recipe") {
  let id;
  do {
    id = `${prefix}-${idCounter++}`;
  } while (usedIds.has(id));
  usedIds.add(id);
  return id;
}

/**
 * Create a new favorite button element
 */
function createFavoriteButton(id) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.classList.add(CONFIG.classes.button);
  btn.setAttribute("aria-label", CONFIG.labels.add);
  btn.setAttribute("data-js-fav-id", id); // associate with recipe id
  return btn;
}

/**
 * Update button appearance based on active state
 */
function updateButtonState(button, isActive) {
  button.setAttribute("aria-pressed", isActive ? "true" : "false");
  button.setAttribute("aria-label", isActive ? CONFIG.labels.remove : CONFIG.labels.add);
  button.classList.toggle(CONFIG.classes.active, isActive);
}

/**
 * Initialize a favorite button for a single item
 */
function initItemFavorite(item, store) {
  const id = getOrCreateId(item);
  const btn = createOrGetButton(item, id);

  if (!btn) return;

  updateButtonState(btn, store.has(id));

  btn.addEventListener("click", () => {
    const isActive = store.toggle(id);
    updateButtonState(btn, isActive);

    // Dispatch a global event for other scripts
    document.dispatchEvent(
      new CustomEvent("favorites:toggle", { detail: { id, active: isActive } })
    );
  });
}

/**
 * Get existing ID or generate a new one for the item
 */
function getOrCreateId(item) {
  let id = item.getAttribute("data-js-fav-id");
  if (!id) {
    id = generateUniqueId();
    item.setAttribute("data-js-fav-id", id);
  }
  return id;
}

/**
 * Create or retrieve the favorite button inside item's container
 */
function createOrGetButton(item, id) {
  const container = item.querySelector(CONFIG.selectors.buttonContainer);

  if (!container) {
    console.warn("Button container not found for item:", item);
    return null;
  }

  // Try to find existing button
  let btn = container.querySelector(`[data-js-fav-badge], .${CONFIG.classes.button}`);

  if (!btn) {
    btn = createFavoriteButton(id);
    container.append(btn);
  } else {
    // Ensure accessibility attributes
    btn.setAttribute("data-js-fav-badge", "");

    if (!btn.hasAttribute("aria-pressed")) btn.setAttribute("aria-pressed", "false");
    if (!btn.hasAttribute("aria-label")) btn.setAttribute("aria-label", CONFIG.labels.add);
  }

  return btn;
}

/**
 * Initialize favorites for all items on the page
 */
export function initFavoriteToggles() {
  const store = new FavoritesStore(CONFIG.storageKey);
  const items = document.querySelectorAll(CONFIG.selectors.item);

  items.forEach((item) => initItemFavorite(item, store));
}
