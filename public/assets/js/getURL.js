function getTinyURL() {
  const urlInput = document.getElementById("ph1");
  const codeInput = document.getElementById("ph2");
  const button = document.getElementById("submitBtn");
  const tokenInput = document.getElementById("turnstileToken");

  const url = urlInput.value.trim();
  const code = codeInput.value.trim();
  const token = (tokenInput?.value || "").trim();

  if (!isValidUrl(url)) {
    alert("Please enter a valid URL.");
    return;
  }

  if (code && !isValidCode(code)) {
    alert("Custom code must be max 8 letters/numbers.");
    return;
  }

  if (!token) {
    alert("Please complete the Turnstile challenge.");
    return;
  }

  button.textContent = "Processing...";
  button.disabled = true;

  fetch("/api/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      full_url: url,
      custom_code: code,
      turnstileToken: token
    })
  })
    .then((response) => {
      if (response.status === 409) throw new Error("Custom code already exists.");
      if (response.status === 429) throw new Error("Too many requests. Try again later.");
      if (!response.ok) throw new Error("Something went wrong.");
      return response.json();
    })
    .then((data) => {
      const result = document.getElementById("result");
      const shortInput = document.getElementById("shortResult");
      shortInput.value = data.url;
      result.classList.add("show");

      if (window.turnstile) {
        window.turnstile.reset();
      }
      if (tokenInput) tokenInput.value = "";
    })
    .catch((error) => {
      alert(error.message);
      console.error(error);
    })
    .finally(() => {
      button.textContent = "Shorten Link →";
      button.disabled = false;
    });
}

function copyToClipboard() {
  const input = document.getElementById("shortResult");
  if (!input?.value) return;
  navigator.clipboard.writeText(input.value);
}

function isValidCode(custom_code) {
  return /^[A-Za-z0-9]{1,8}$/.test(custom_code);
}

function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
