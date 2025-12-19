import * as iaService from "../services/Ia.js"

const iaController = {
    
    getIaFactVerdict: async (req, res) => {
        const { content } = req.body;
        console.log(content)
        try {
        const iaVerdict = await iaService.getIaFactVerdict(content);
        res.status(200).json(iaVerdict);
        } catch (err) {
            console.error("Error en el controlador al obtener veredicto de la IA: ", err.message);
            res.status(500).json({ error: "Error interno del servidor al obtener el veredicto de la IA" });
        }
    }
}

export default iaController;