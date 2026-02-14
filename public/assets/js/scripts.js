document.addEventListener("DOMContentLoaded", () => {
  const themeBtn = document.getElementById("themeToggle");
  const advanced = document.getElementById("advanced");
  const advancedToggle = document.getElementById("advancedToggle");
  const form = document.getElementById("shortenForm");

  function updateIcon() {
    themeBtn.textContent = document.body.classList.contains("dark-mode") ? "☀️" : "🌙";
  }

  function switchMode() {
    document.body.classList.toggle("dark-mode");
    localStorage.setItem("theme", document.body.classList.contains("dark-mode") ? "dark" : "light");
    updateIcon();
  }

  themeBtn.addEventListener("click", switchMode);

  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark" || (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
    document.body.classList.add("dark-mode");
  }
  updateIcon();

  advancedToggle.addEventListener("click", () => {
    advanced.classList.toggle("open");
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    getTinyURL();
  });

  const copyBtn = document.getElementById("copyBtn");
  copyBtn?.addEventListener("click", () => copyToClipboard());
});
