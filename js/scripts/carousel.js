export function initCarousel() {
  const carousels = document.querySelectorAll("[data-js-carousel]");

  carousels.forEach((carousel) => {
    const track = carousel.querySelector(".hero__track");
    const slides = carousel.querySelectorAll(".hero__slide");

    if (slides.length === 0) return;

    slides.forEach((slide, i) => {
      slide.dataset.slide = i + 1;
      slide.classList.add(`slider-${i + 1}`);
    });

    let dots = [];
    if (slides.length > 1) {
      let indicators = document.createElement("div");
      indicators.classList.add("hero__indicators");
      slides.forEach((_, i) => {
        const dot = document.createElement("span");
        dot.setAttribute("role", "button");
        dot.setAttribute("aria-label", `Go to slide ${i + 1}`);
        indicators.appendChild(dot);
        dots.push(dot);
      });
      carousel.appendChild(indicators);
    }

    let index = 0;
    const interval = parseInt(carousel.dataset.interval) || 3000;
    let timer;

    function showSlide(i) {
      index = (i + slides.length) % slides.length; // loop
      track.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach((dot, j) => dot.classList.toggle("active", j === index));
    }

    dots.forEach((dot, i) => {
      dot.addEventListener("click", () => {
        showSlide(i);
        resetTimer();
      });
    });

    function startTimer() {
      timer = setInterval(() => showSlide(index + 1), interval);
    }
    function resetTimer() {
      clearInterval(timer);
      startTimer();
    }

    carousel.addEventListener("mousemove", (e) => {
      if (slides.length <= 1) return;
      const rect = carousel.getBoundingClientRect();
      const x = e.clientX - rect.left;
      carousel.style.cursor = x < rect.width / 2 ? "w-resize" : "e-resize";
    });

    carousel.addEventListener("click", (e) => {
      if (slides.length <= 1) return;
      const rect = carousel.getBoundingClientRect();
      const x = e.clientX - rect.left;
      if (x < rect.width / 2) showSlide(index - 1);
      else showSlide(index + 1);
      resetTimer();
    });

    document.addEventListener("keydown", (e) => {
      if (slides.length <= 1) return;
      if (e.key === "ArrowLeft") showSlide(index - 1);
      if (e.key === "ArrowRight") showSlide(index + 1);
    });

    track.style.display = "flex";
    track.style.transition = "none";
    slides.forEach((s) => (s.style.flex = "0 0 100%"));

    showSlide(index);

    requestAnimationFrame(() => {
      track.style.transition = "transform 0.5s ease";
      if (slides.length > 1) startTimer();
    });
  });
}
