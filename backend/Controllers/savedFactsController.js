import * as savedFactsService from '../Servicies/savedFactsService.js';

//guardar/desguardar
export const toggleSave = async (req, res) => {
    try {
        //aca se obtiene el id del usuario loggeado
        const userId = req.user.id; 

        const { factId } = req.body;

        if (!factId) {
            return res.status(400).json({ error: "Falta el factId" });
        }

        const result = await savedFactsService.toggleSaveFact(userId, factId);
        res.json(result);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al procesar el guardado." });
    }
};

//ver repo
export const getSavedFacts = async (req, res) => {
    try {
        //se verifica quien soy yo
        const userIdFromToken = req.user.id; 
        
        //que repo quiero ver
        const userIdRequested = req.params.userId;

        //si el dueño del token es diferente al dueño del repo tiramos error
        if (userIdFromToken != userIdRequested) {
            return res.status(403).json({ error: "Acceso denegado. No podés ver los guardados de otro usuario." });
        }

        //si pasa la validacion se muestra el repo
        const facts = await savedFactsService.getMySavedFacts(userIdFromToken);
        res.json(facts);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener la lista." });
    }
};