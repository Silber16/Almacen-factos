import * as factsService from '../services/FactsService.js';

const factsController = {
    
    getAll: async (req, res) => {
         console.log('entra getAll');
        try {
        const facts = await factsService.getAllFacts();
        res.status(200).json(facts);
        } catch (err) {
            console.error("Error en el controlador al obtener facts: ", err.message);
            res.status(500);
        }
    },

    getById: async (req, res) => {
        const factId = Number(req.params.id);

        if (isNaN(factId) || factId <= 0)
            return res.status(400).json({ message: "El ID no es valido" });

        try {
            const fact = await factsService.getFact(factId);
            
            if (fact) {
                res.status(200).json(fact);
            } else {
                res.status(404).json({ message: `No se encontro el fact con ID ${factId}.` });
            }
        } catch (error) {
            console.error("Error en el controlador al obtener fact: ", error.message);
            res.status(500);
        }
    },

    getByUserId: async (req, res) => {
        const userId = Number(req.params.userId);

        if (isNaN(userId) || userId <= 0) {
            return res.status(400).json({ message: "El ID no es valido." });
        }

        try {
            const facts = await factsService.getFactsByUser(userId);
            res.status(200).json(facts);

        } catch (error) {
            console.error("Error en el controlador al obtener facts: ", error.message);
            res.status(500);
        }
    },

    getByCategory: async (req, res) => {
        const category = req.params.category;
        try {
            const facts = await factsService.getFactsByCategoryName(category);
            res.status(200).json(facts);

        } catch (error) {
            console.error("Error en el controlador al obtener facts: ", error.message);
            res.status(500);
        }
    },

    create: async (req, res) => {
        const factData = req.body;
        const userId = req.user.id;
        
        factData.createdBy = userId;

        if (!factData) {
            return res.status(400).json({ message: "El contenido del facto no puede estar vacio." });
        }

        try {
            const success = await factsService.createNewFact(factData);

            if (success) {
                res.status(201).json({ message: "Facto creado exitosamente." });
            } else {
                res.status(500).json({ message: "Error al crear el facto." });
            }
        } catch (err) {
            console.error("Error en el controlador al crear facto: ", err.message);
            res.status(500);
        }
    },

    update: async (req, res) => {
        const factId = Number(req.params.id);
        const factData = req.body;

        if (!factData) {
            return res.status(400).json({ message: "El contenido del facto no puede estar vacio." });
        } 
        
        if (isNaN(factId) || factId <= 0) {
            return res.status(400).json({ message: "ID de facto no válido." });
        }
        
        factData.id = factId;

        try {
            const success = await factsService.updateExistingFact(factData);

            if (success) {
                res.status(200).json({ message: `Hecho con ID ${factId} actualizado exitosamente.` });
            } else {
                res.status(404).json({ message: `Hecho con ID ${factId} no encontrado para actualizar.` });
            }
        } catch (error) {
            console.error("Error en el controlador al actualizar facto: ", error.message);
            res.status(500);
        }
    },

    remove: async (req, res) => {
        const factId = Number(req.params.id);

        if (isNaN(factId) || factId <= 0) {
            return res.status(400).json({ message: "ID de facto no válido." });
        }

        try {
            const success = await factsService.deleteFactById(factId);

            if (success) {
                res.status(204).send(); 
            } else {
                res.status(404).json({ message: `Hecho con ID ${factId} no encontrado para eliminar.` });
            }
        } catch (error) {
            console.error("Error en el controlador remove:", error.message);
            res.status(500).json({ message: "Error interno del servidor. Posiblemente por dependencias (claves foráneas)." });
        }
    }
};

export default factsController;