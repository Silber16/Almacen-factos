import authService from "../services/login.js";
const register = async (req, res) => {
    try {
        const user = await authService.register(req.body);
        res.json({ message: "usuario creado con exito", user });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
const login = async (req, res) => {
    try {
        const data = await authService.login(req.body);
        res.json({ message: "login correcto", ...data });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
const me = async (req, res) => {
    try {
        const user = await authService.me(req.user.id);
        res.json(user);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
};
export default { register, login, me };