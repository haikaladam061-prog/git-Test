// ================= AUTH CHECK =================
const loggedInUser = JSON.parse(localStorage.getItem("currentUser"));
if (loggedInUser) {
  window.location.href = "Mengaji.html";
}

// ================== ELEMENTS ==================
const flipContainer = document.getElementById("flip-container");
const toSignUp = document.getElementById("toSignUp");
const toSignIn = document.getElementById("toSignIn");
const loginBtn = document.getElementById("loginBtn");
const signUpBtn = document.getElementById("signUpBtn");

const loginUsername = document.getElementById("loginUsername");
const loginPassword = document.getElementById("loginPassword");

const fullName = document.getElementById("fullName");
const signUpUsername = document.getElementById("signUpUsername");
const signUpEmail = document.getElementById("signUpEmail");
const signUpPassword = document.getElementById("signUpPassword");

// ================== FLIP ==================
toSignUp.addEventListener("click", () => {
  flipContainer.classList.add("flipped");
});

toSignIn.addEventListener("click", () => {
  flipContainer.classList.remove("flipped");
});

// ================== HELPERS ==================
function getUsers() {
  return JSON.parse(localStorage.getItem("users")) || [];
}

function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

// ================== SIGN UP ==================
signUpBtn.addEventListener("click", async () => {
  const name = fullName.value.trim();
  const username = signUpUsername.value.trim();
  const email = signUpEmail.value.trim();
  const password = signUpPassword.value;

  if (!name || !username || !email || !password) {
    alert("Please fill in all fields");
    return;
  }

  if (password.length < 6) {
    alert("Password must be at least 6 characters");
    return;
  }

  const users = getUsers();

  const userExists = users.some(
    u => u.username === username || u.email === email
  );

  if (userExists) {
    alert("Username or Email already exists");
    return;
  }

  const hashedPassword = await hashPassword(password);

  const newUser = {
    id: crypto.randomUUID(),
    name,
    username,
    email,
    password: hashedPassword,
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  saveUsers(users);

  alert("Account created successfully! Please sign in.");
  flipContainer.classList.remove("flipped");

  fullName.value = "";
  signUpUsername.value = "";
  signUpEmail.value = "";
  signUpPassword.value = "";
});

// ================== SIGN IN ==================
loginBtn.addEventListener("click", async () => {
  const username = loginUsername.value.trim();
  const password = loginPassword.value;

  if (!username || !password) {
    alert("Please enter username and password");
    return;
  }

  const users = getUsers();
  const hashedPassword = await hashPassword(password);

  const user = users.find(
    u => u.username === username && u.password === hashedPassword
  );

  if (!user) {
    alert("Invalid username or password");
    return;
  }

  localStorage.setItem(
    "currentUser",
    JSON.stringify({
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email
    })
  );

  window.location.href = "Mengaji.html";
});

// ================== RESET FLIP ==================
window.addEventListener("load", () => {
  flipContainer.classList.remove("flipped");
});