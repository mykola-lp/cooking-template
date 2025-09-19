// js/scripts/load-more.js

const MAX_VISIBLE = 8;

const SELECTORS = {
  list: 'recipes-popular__list',
  item: 'recipes-popular__card',
  isHidden: 'is-hidden',
  loadMore: 'load-more',
};

let expanded = false;

/**
 * Returns the container element
 */
function getContainer() {
  return document.querySelector(`.${SELECTORS.list}`) || document.querySelector('[data-js-load-more]');
}

/**
 * Returns an array of item elements within the container
 */
function getItems(container) {
  return Array.from(container.querySelectorAll(`.${SELECTORS.item}`));
}

/**
 * Updates the visibility state of the list
 */
function updateItems(items) {
  items.forEach((item, index) => {
    const shouldBeVisible = expanded || index < MAX_VISIBLE;
    item.hidden = !shouldBeVisible;

    item.classList.toggle(SELECTORS.isHidden, !shouldBeVisible);
    item.setAttribute('aria-hidden', String(!shouldBeVisible));
  });
}

/**
 * Remove exiting button element
 */
function removeExistingButton() {
  const existing = document.getElementById(SELECTORS.loadMore);

  if (existing) {
    const wrapper = existing.closest('.load-more-wrapper');
    wrapper?.remove();
  }
}

/**
 * Creates and appends the "Load More" button to the container
 */
function createToggleButton(container, items) {
  const wrapper = document.createElement('div');
  wrapper.className = 'load-more-wrapper';

  const btn = Object.assign(document.createElement('button'), {
    type: 'button',
    id: SELECTORS.loadMore,
    className: 'load-more-btn',
    textContent: '↓',
  });

  btn.setAttribute('aria-expanded', 'false');
  btn.setAttribute('aria-label', 'Show more recipes');

  if (container.id) btn.setAttribute('aria-controls', container.id);

  wrapper.append(btn);
  container.after(wrapper);

  btn.addEventListener('click', () => {
    expanded = !expanded;
    updateItems(items);

    btn.textContent = expanded ? '↑' : '↓';
    btn.setAttribute('aria-expanded', String(expanded));
    btn.setAttribute(
      'aria-label',
      expanded ? 'Hide the list of recipes' : 'Show more recipes'
    );

    if (expanded) {
      // open
      btn.scrollIntoView({ behavior: 'smooth', block: 'end' });
    } else {
      // close
      btn.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });
}

/**
 * Initialize "Load More" button initialization
 */
export function initLoadMore() {
  const container = getContainer();

  if (!container) {
    console.warn(`Selector "${SELECTORS.list}" not found`);
    return;
  }
  container?.classList.add('js-ready');

  const items = getItems(container);

  if (!items) {
    console.warn(`Selector "${SELECTORS.item}" not found`);
    return;
  }

  // initial state
  updateItems(items);

  items.length > MAX_VISIBLE
    ? createToggleButton(container, items)
    : removeExistingButton();
}
