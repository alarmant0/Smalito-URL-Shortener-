document.addEventListener("DOMContentLoaded", () => {
  console.log("signup.js loaded");

  const form = document.getElementById("signupForm");
  const email = document.getElementById("email");
  const emailMsg = document.getElementById("emailMsg");

  const pw = document.getElementById("password");
  const pwToggle = document.getElementById("pwToggle");

  const setEmailError = (msg) => {
    emailMsg.textContent = msg || "";
    emailMsg.classList.toggle("show", !!msg);
    email.classList.toggle("invalid", !!msg);
  };

  pwToggle?.addEventListener("click", () => {
    const isPw = pw.type === "password";
    pw.type = isPw ? "text" : "password";
    pwToggle.textContent = isPw ? "Hide" : "Show";
  });

  email?.addEventListener("input", () => setEmailError(""));

  form?.addEventListener("submit", (e) => {
    e.preventDefault();

    const value = (email?.value || "").trim();
    const password = (pw?.value || "").trim();

    console.log("submit:", { value, passwordLength: password.length });

    if (!value || !value.includes("@")) {
      setEmailError("Please enter a valid email address.");
      return;
    }

    if (password.length < 8) {
      alert("Password must be at least 8 characters.");
      return;
    }

    signUp(value, password);
  });

  async function signUp(emailValue, passwordValue) {
    console.log("signUp called", emailValue);
    const info = {
    	username: emailValue,
    	password: passwordValue
    };
    const res = await fetch("/api/user/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(info)
    });

    const text = await res.text();
    console.log("signup response:", res.status, text);

	let data;
	try { data = JSON.parse(text); } catch { data = null; }
	// handle response
	if (!res.ok) {
		throw new Error(data?.error || text || "Signup failed");
	}
	window.location.href = "/dashboard";
	return data;
  }
});
