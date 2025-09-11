// scripts/logo-animation.js

export function initLogoAnimations() {
  document.querySelectorAll(".logo").forEach(logo => {
    setTimeout(() => {
      logo.classList.add("visible");
    }, 100);
  });
}

