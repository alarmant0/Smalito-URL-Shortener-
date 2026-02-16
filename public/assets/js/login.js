// public/assets/js/login.js
document.addEventListener("DOMContentLoaded", () => {
  // Theme
  const themeBtn = document.getElementById("themeToggle");
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "dark" || (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
    document.body.classList.add("dark-mode");
  }
  themeBtn.textContent = document.body.classList.contains("dark-mode") ? "☀️" : "🌙";

  themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    localStorage.setItem("theme", document.body.classList.contains("dark-mode") ? "dark" : "light");
    themeBtn.textContent = document.body.classList.contains("dark-mode") ? "☀️" : "🌙";
  });

  // Password show/hide
  const pw = document.getElementById("password");
  const pwToggle = document.getElementById("pwToggle");
  pwToggle.addEventListener("click", () => {
    const isPw = pw.type === "password";
    pw.type = isPw ? "text" : "password";
    pwToggle.textContent = isPw ? "Hide" : "Show";
  });

  // Email validation UI
  const email = document.getElementById("email");
  const emailMsg = document.getElementById("emailMsg");

  const setEmailError = (msg) => {
    emailMsg.textContent = msg || "";
    emailMsg.classList.toggle("show", !!msg);
    email.classList.toggle("invalid", !!msg);
  };

  email.addEventListener("input", () => setEmailError(""));

  // Login submit
  const form = document.getElementById("loginForm");
  const loginBtn = document.getElementById("loginBtn");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const emailValue = (email.value || "").trim().toLowerCase();
    const passwordValue = (pw.value || "").trim();

    if (!emailValue || !emailValue.includes("@")) {
      setEmailError("Please enter a valid email address.");
      return;
    }

    loginBtn.disabled = true;
    loginBtn.textContent = "Signing in...";

    try {
      const res = await fetch("/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: emailValue, password: passwordValue }),
      });

      const text = await res.text();
      let data = null;
      try { data = JSON.parse(text); } catch {}

      if (!res.ok) throw new Error(data?.error || text || "Login failed");

      window.location.href = "/dashboard";
    } catch (err) {
      console.error(err);
      alert(err.message || "Login failed");
    } finally {
      loginBtn.disabled = false;
      loginBtn.textContent = "Sign in";
    }
  });

  // Google (GIS)
  const GOOGLE_CLIENT_ID = "965314062049-gu023p97ugacvn4sdvbsk8tisbr0a8r2.apps.googleusercontent.com";

  function initGoogle() {
    if (!window.google || !google.accounts || !google.accounts.id) return;

    google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: async (response) => {
        try {
          const credential = response.credential;
          if (!credential) throw new Error("Missing Google credential");

          const res = await fetch("/api/auth/google", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ credential }),
          });

          const data = await res.json().catch(() => ({}));
          if (!res.ok) throw new Error(data?.error || "Google auth failed");

          window.location.href = "/dashboard";
        } catch (err) {
          console.error(err);
          alert(err.message || "Google sign-in failed");
        }
      },
    });

    google.accounts.id.renderButton(
      document.getElementById("googleBtnWrap"),
      { theme: "outline", size: "large", width: 420, text: "signin_with", shape: "pill" }
    );
  }

  window.addEventListener("load", initGoogle);
});
