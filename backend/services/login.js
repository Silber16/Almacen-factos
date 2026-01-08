import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userRepo from "../repositories/login.js";
const securePassword = (password) => {
    if (password.length < 8) return "La contraseña debe tener al menos 8 caracteres";
    if (!/[A-Z]/.test(password)) return "Debe contener una mayúscula";
    if (!/[a-z]/.test(password)) return "Debe contener una minúscula";
    if (!/[0-9]/.test(password)) return "Debe contener un número";
    if (!/[!@#$%^&*(),.?":{}|<>_\-]/.test(password)) return "Debe contener un símbolo";
    return null;
};
const register = async ({ username, email, password }) => {
    if (!username || !email || !password) {
        throw new Error("faltan datos");
    }
    const passwordError = securePassword(password);
    if (passwordError) {
        throw new Error(passwordError);
    }
    const exists = await userRepo.existsemailorusername(email, username);
    if (exists) {
        throw new Error("email o username ya registrado");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    return await userRepo.createUser(username, email, hashedPassword);
};
const login = async ({ identifier, password }) => {
    const user = await userRepo.emailorusername(identifier);
    if (!user) {
        throw new Error("usuario no encontrado");
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        throw new Error("contraseña incorrecta");
    }
    const token = jwt.sign(
        { id: user.id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );
    return {
        token,
        user: { id: user.id, username: user.username }
    };
};
const me = async (userId) => {
    const user = await userRepo.findId(userId);
    if (!user) {
        throw new Error("usuario no encontrado");
    }
    return user;
};
export default { register, login, me };
