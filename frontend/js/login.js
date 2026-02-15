const btnLogin = document.getElementById("btn-login");
const btnRegister = document.getElementById("btn-register");
const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");
const subtitle = document.getElementById("subtitle");

btnLogin.addEventListener("click", () => {
    btnLogin.classList.add("active");
    btnRegister.classList.remove("active");
    loginForm.style.display = "block";
    registerForm.style.display = "none";
    subtitle.textContent = "Bienvenido de vuelta";
});

btnRegister.addEventListener("click", () => {
    btnRegister.classList.add("active");
    btnLogin.classList.remove("active");
    loginForm.style.display = "none";
    registerForm.style.display = "block";
    subtitle.textContent = "Unite a nuestra comunidad";
});

loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const identifier = document.getElementById("login-identifier").value;
    const password = document.getElementById("login-password").value;

    const res = await fetch(`${import.meta.env.VITE_VITE_BACKEND_URI}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password })
    });

    const data = await res.json();

    if (res.ok) {
        alert("Login exitoso");
        localStorage.setItem("token", data.token);
        window.location.href = './feed.html';
    }
    else {
        alert(data.error);
    }
});

registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const userData = {
        email: document.getElementById("reg-email").value,
        username: document.getElementById("reg-username").value,
        password: document.getElementById("reg-password").value,    
    };
    if (!userData.username.trim()) {
        alert("El username no puede estar vacío");
        return;
    }

const res = await fetch(`${import.meta.env.VITE_VITE_BACKEND_URI}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData)
});

    const data = await res.json();

    if (res.ok) {
        alert("Cuenta creada con éxito");
        btnLogin.click();
    } else {
        alert(data.error);
    }
});

