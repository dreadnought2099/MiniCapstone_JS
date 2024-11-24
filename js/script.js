// Login Form
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;
    const storedEmail = localStorage.getItem("userEmail");
    const storedPassword = localStorage.getItem("userPass");

    if (email === storedEmail && password === storedPassword) {
      alert("Login successful.");
      localStorage.setItem("isLoggedIn", "true");
      window.location.href = "../html/dashboard.html";
    } else {
      document.getElementById("errorMessage").innerText =
        "Invalid email or password. Please try again.";
    }
  });
}

// Register Form
const registerForm = document.getElementById("registerForm");
if (registerForm) {
  registerForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;
    if (email && password) {
      localStorage.setItem("userEmail", email);
      localStorage.setItem("userPass", password);
      alert("Registration successful. You can now log in.");
      window.location.href = "../index.html";
    } else {
      alert("Please fill out all fields for registration.");
    }
  });
}
