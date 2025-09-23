const SELECTORS = {
  wrapper: 'instagram-posts__image-wrapper',
  img: 'instagram-posts__img',
  dots: 'instagram-posts__dots',
  counter: 'instagram-posts__post-number',
  prev: 'instagram-posts__prev',
  next: 'instagram-posts__next'
};

/**
 * Show image at a specific index and update UI elements
 */
function showImage(wrapper, images, dotsContainer, counter, index) {
  // Toggle visibility for all images
  images.forEach((img, i) => toggleVisibility(img, i === index));

  // Update dots and counter
  dotsContainer && updateDots(dotsContainer, index, images.length, images, counter);
  updateCounter(counter, index, images.length);

  // Persist current index
  sessionStorage.setItem(wrapper.dataset.sliderId, index);

  // Show/hide navigation buttons
  updateNavButtons(wrapper, index, images.length);
}

/**
 * Toggle visibility and active state of an element.
 */
function toggleVisibility(el, isVisible) {
  if (!el) return;
  el.style.display = isVisible ? 'block' : 'none';
  el.classList.toggle('is-active', isVisible);
}

/**
 * Update counter element
 */
function updateCounter(counter, index, total) {
  if (!counter) return;
  counter.textContent = `${index + 1}/${total}`;
  counter.classList.add('visible');
}

/**
 * Show/hide prev/next buttons based on current index
 */
function updateNavButtons(wrapper, index, total) {
  const buttons = [
    { el: wrapper.querySelector(`.${SELECTORS.prev}`), show: index > 0 },
    { el: wrapper.querySelector(`.${SELECTORS.next}`), show: index < total - 1 },
  ];

  buttons.forEach(({ el, show }) => {
    if (!el) return;
    el.style.display = show ? 'block' : 'none';
  });
}

/**
 * Create a single dot button
 */
function createDot(index, currentIndex, dotsContainer, images, counter) {
  const dot = document.createElement('button');
  dot.className = 'instagram-posts__dot';

  if (index === currentIndex) addClassOnce(dot, 'is-active');

  dot.setAttribute('aria-selected', index === currentIndex ? 'true' : 'false');

  dot.addEventListener('click', () => {
    const wrapper = dotsContainer.closest(`.${SELECTORS.wrapper}`);
    showImage(wrapper, images, dotsContainer, counter, index);
  });

  return dot;
}

/**
 * Create the "+N" indicator for remaining slides
 */
function createMoreDot(remaining) {
  const moreDot = Object.assign(document.createElement('span'), {
    textContent: `+${remaining}`,
    className: 'instagram-posts__dot--more'
  });

  return moreDot;
}

/**
 * Update the dots navigation for the slider.
 */
function updateDots(dotsContainer, currentIndex, total, images, counter) {
  if (!dotsContainer) return;
  dotsContainer.innerHTML = '';

  const maxDots = 7;
  const visibleCount = Math.min(total, maxDots);

  for (let i = 0; i < visibleCount; i++) {
    dotsContainer.appendChild(createDot(i, currentIndex, dotsContainer, images, counter));
  }

  if (total > maxDots) {
    dotsContainer.appendChild(createMoreDot(total - maxDots));
  }

  Array.from(dotsContainer.children).forEach((dot, i) => {
    if (!dot.classList.contains('instagram-posts__dot--more')) {
      dot.setAttribute('aria-selected', i === currentIndex ? 'true' : 'false');
    }
  });

  dotsContainer.classList.add('visible');
}

/**
 * Adds a CSS class to an element only if it doesn't already have it.
 */
function addClassOnce(el, className) {
  if (!el.classList.contains(className)) el.classList.add(className);
}

/**
 * Initialize navigation buttons and keyboard controls
 */
function sliderNavigation(wrapper, images, dotsContainer, counter) {
  let currentIndex = Number(sessionStorage.getItem(wrapper.dataset.sliderId)) || 0;

  const prevBtn = wrapper.querySelector(`.${SELECTORS.prev}`);
  const nextBtn = wrapper.querySelector(`.${SELECTORS.next}`);

  const goTo = (index) => {
    if (index < 0 || index >= images.length) return;
    currentIndex = index;
    showImage(wrapper, images, dotsContainer, counter, currentIndex);
  };

  // Map of button elements and their delta movement
  const buttons = [
    { el: prevBtn, delta: -1 },
    { el: nextBtn, delta: +1 },
  ];

  buttons.forEach(({ el, delta }) => {
    if (!el) return;
    el.addEventListener('click', () => goTo(currentIndex + delta));
  });

  // Keyboard navigation mapping
  const keyMap = {
    ArrowLeft: -1,
    ArrowRight: +1,
    Home: 'start',
    End: 'end',
  };

  wrapper.addEventListener('keydown', (e) => {
    const action = keyMap[e.key];
    if (!action) return;

    e.preventDefault();
    if (action === 'start') goTo(0);
    else if (action === 'end') goTo(images.length - 1);
    else goTo(currentIndex + action);
  });

  wrapper.setAttribute('tabindex', '0');

  // Initial display
  showImage(wrapper, images, dotsContainer, counter, currentIndex);
}

function show(el) {
  if (el) el.style.display = 'block';
}

function hide(el) {
  if (el) el.style.display = 'none';
}

function toggleClass(el, className, condition) {
  if (!el) return;
  el.classList.toggle(className, condition);
}

/**
 * Initialize gallery slider
 */
export function initGallerySlider(container) {
  const wrapper = container.querySelector(`.${SELECTORS.wrapper}`);
  if (!wrapper) return;

  const images = Array.from(wrapper.querySelectorAll(`.${SELECTORS.img}`));
  if (!images.length) return;

  const dotsContainer = container.querySelector(`.${SELECTORS.dots}`);
  const counter = wrapper.querySelector(`.${SELECTORS.counter}`);

  const singleImage = images.length === 1;

  toggleClass(wrapper, 'single-image', singleImage);

  if (!singleImage) {
    sliderNavigation(wrapper, images, dotsContainer, counter);
  } else {
    // Show only the first image and hide all navigation elements if there's only one slide
    show(images[0]);
    hide(dotsContainer);
    hide(counter);
    hide(wrapper.querySelector(`.${SELECTORS.prev}`));
    hide(wrapper.querySelector(`.${SELECTORS.next}`));
  }

  wrapper.classList.add('initialized');
}
