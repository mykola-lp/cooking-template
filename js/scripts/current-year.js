export function initCurrentYear() {
  const yearEl = document.getElementById("current-year");

  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}