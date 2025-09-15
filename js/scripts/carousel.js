// Carousel functionality for the hero section

export function initCarousel() {
  const carousel = document.querySelector("[data-js-carousel]");
  if (!carousel) return;

  const viewport = carousel.querySelector(".hero__viewport") || carousel;
  const track = carousel.querySelector(".hero__track");
  const slides = Array.from(track.children);

  if (slides.length <= 1) return; // 0 or 1 slide → do nothing

  // --- STATE ---
  let current = 0;
  let direction = 1; // 1 = forward, -1 = backward
  let autoplayTimer = null;

  const AUTOPLAY_DELAY = parseInt(carousel.dataset.interval) || 3000;
  const STEP_DELAY = 400;

  // --- DOTS ---
  const dotsContainer = getOrCreateDotsContainer(carousel);
  const dots = createDots(slides, dotsContainer);

  // --- INITIAL SETUP ---
  updateUI();
  startAutoplay();
  setupAutoplayToggle();
  setupMouseCursor();
  setupViewportClick();
  setupKeyboardNavigation();

  // --- FUNCTIONS ---
  function getOrCreateDotsContainer(carousel) {
    let container = carousel.querySelector(".hero__indicators");
  
    if (!container) {
      container = document.createElement("div");
      container.classList.add("hero__indicators");
      carousel.appendChild(container);
    }
  
    return container;
  }

  function createDots(slides, container) {
    const dotsArr = [];

    slides.forEach((_, idx) => {
      const dot = document.createElement("span");

      dot.setAttribute("role", "button");
      dot.setAttribute("aria-label", `Go to slide ${idx + 1}`);

      if (idx === 0) dot.classList.add("active");

      dot.addEventListener("click", () => goToSlide(idx));
      container.appendChild(dot);
      dotsArr.push(dot);
    });

    return dotsArr;
  }

  function updateUI() {
    slides.forEach((s, i) => s.classList.toggle("active", i === current));
    dots.forEach((d, i) => d.classList.toggle("active", i === current));
    track.style.transform = `translateX(-${current * 100}%)`;
  }

  function nextSlide() {
    let next = current + direction;

    if (next >= slides.length || next < 0) {
      direction = -direction;
      next = current + direction;
    }

    current = next;
    updateUI();
  }

  function stopAutoplay() {
    clearInterval(autoplayTimer);
    autoplayTimer = null;
  }

  function startAutoplay() {
    stopAutoplay();

    if (!isAutoplayAllowed()) return;
    autoplayTimer = setInterval(nextSlide, AUTOPLAY_DELAY);
  }

  function resetAutoplay() {
    stopAutoplay();
    startAutoplay();
  }

  function isAutoplayAllowed() {
    return window.matchMedia("(min-width: 769px)").matches;
  }

  function goToSlide(target) {
    stopAutoplay();
    current = target;
    updateUI();
    setTimeout(resetAutoplay, STEP_DELAY);
  }

  function setupMouseCursor() {
    carousel.addEventListener("mousemove", (e) => {
      const rect = carousel.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const leftZone = rect.width * 0.2;
      const rightZone = rect.width * 0.8;

      if (x < leftZone) carousel.style.cursor = "w-resize";
      else if (x > rightZone) carousel.style.cursor = "e-resize";
      else carousel.style.cursor = "default";
    });
  }

  function setupViewportClick() {
    viewport.addEventListener("click", (e) => {
      const rect = viewport.getBoundingClientRect();
      const x = e.clientX - rect.left;

      if (x < rect.width / 2) goToSlide(Math.max(0, current - 1));
      else goToSlide(Math.min(slides.length - 1, current + 1));
    });
  }

  function setupKeyboardNavigation() {
    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") goToSlide(Math.max(0, current - 1));
      if (e.key === "ArrowRight") goToSlide(Math.min(slides.length - 1, current + 1));
    });
  }

  function setupAutoplayToggle() {
    const mediaQuery = window.matchMedia("(min-width: 769px)");

    const handleResize = () => {
      if (mediaQuery.matches) startAutoplay();
      else stopAutoplay();
    };

    handleResize();
    mediaQuery.addEventListener("change", handleResize);
  }
}
