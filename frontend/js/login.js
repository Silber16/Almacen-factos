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
    registerForm.reset();
    document.getElementById("register-error").style.display = "none";
});

btnRegister.addEventListener("click", () => {
    btnRegister.classList.add("active");
    btnLogin.classList.remove("active");
    loginForm.style.display = "none";
    registerForm.style.display = "block";
    subtitle.textContent = "Unite a nuestra comunidad";
    loginForm.reset();
    document.getElementById("login-error").style.display="none";
});

loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    document.getElementById("login-error").style.display = "none";
    const identifier = document.getElementById("login-identifier").value;
    const password = document.getElementById("login-password").value;

    const res = await fetch(`${import.meta.env.VITE_BACKEND_URI}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password })
    });

    const data = await res.json();

    if (res.ok) {
        localStorage.setItem("token", data.token);
        window.location.href = './feed.html';
    }
    else {
        const errorElement = document.getElementById("login-error");
        errorElement.textContent = data.error || "Contraseña incorrecta";
        errorElement.style.display = "block";
    }
});

registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const regError = document.getElementById("register-error");
    regError.style.display = "none";
    const userData = {
        email: document.getElementById("reg-email").value,
        username: document.getElementById("reg-username").value,
        password: document.getElementById("reg-password").value,    
    };
    const confirmpassword = document.getElementById("reg-password2").value;
    if(userData.password !== confirmpassword){
        regError.textContent = "Las contraseñas no coinciden.";
        regError.style.display = "block";
        document.getElementById("reg-password2").value = "";
        document.getElementById("reg-password2").focus();
        return;
    }
    if (!userData.username.trim()) {
        regError.textContent = "El username no puede estar vacío.";
        regError.style.display = "block";
        return;
    }

    const pass = userData.password;

    const valid =
        pass.length >= 8 &&
        /[A-Z]/.test(pass) &&
        /\d/.test(pass);

    if (!valid) {
        regError.textContent =
            "La contraseña debe tener mínimo 8 caracteres, una mayúscula y un número.";
        regError.style.display = "block";
        return;
    }

    const confirmPassword = document.getElementById("reg-password2").value;

    if (userData.password !== confirmPassword) {
        regError.textContent = "Las contraseñas no coinciden.";
        regError.style.display = "block";
        return;
    }

const res = await fetch(`${import.meta.env.VITE_BACKEND_URI}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData)
});

    const data = await res.json();

    if (res.ok) {
        alert("Cuenta creada con éxito");
        btnLogin.click();
    } else {
        regError.textContent = data.error || "Error al registrarse";
        regError.style.display = "block";
    }
});

