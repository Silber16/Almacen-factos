import * as factsService from '../services/FactsService.js';
import quizRepository from '../repositories/quizRepository.js';
import { analyzeFact } from "../services/Ia.js";


const factsController = {
    
    getAll: async (req, res) => {
        try {
            const limit = parseInt(req.query.limit) || 10;
            const offset = parseInt(req.query.offset) || 0;

            const facts = await factsService.getAllFacts(limit, offset);
            res.status(200).json(facts);
        } catch (err) {
            console.error("Error en el controlador al obtener facts: ", err.message);
            res.status(500).json({ error: err.message });
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
        //se obtienen los datos del body
        const factData = req.body;
        const userId = req.user.id;
        
        factData.createdBy = userId;

        if (!factData) {
            return res.status(400).json({ message: "El contenido del facto no puede estar vacio." });
        }
        
        try {
            //se llama a la ia (verificacion y quiz)
            const aiResult = await analyzeFact(factData.title, factData.content);
            let verdict = "Pendiente"
            let explanation = "Procesando"

            if (aiResult && aiResult.verification) {
                verdict = aiResult.verification.verdict.slice(0, 10);
                explanation = aiResult.verification.explanation;
            } else {
                verdict = "Error";
                explanation = "Fallo critico en IA.";
            }
            //se agregan los datos de la ia al objeto q va al service
            factData.ia_response = explanation;
            factData.ia_responseverdict = verdict;

            //se guarda la factura
            const newFact = await factsService.createNewFact(factData);

            //verifico si se creo correctamente
            if (newFact) {
                //se guarda la pregunta de quiz
                if (aiResult && aiResult.quiz && newFact.id) {
                    await quizRepository.createQuizQuestion(
                        newFact.id,
                        aiResult.quiz.question_text,
                        aiResult.quiz.correct_answer,
                        aiResult.quiz.explanation,
                        aiResult.quiz.difficulty
                    );
                    console.log("Pregunta de quiz guardada.");
                }

                res.status(201).json({
                    message: "Facto creado exitosamente.",
                    fact: newFact
                });
            } else {
                res.status(500).json({ message: "Error al crear facto." });
            }
        } catch(err) {
            console.error("Error en el controlador al crear facto: ", err.message);
            res.status(500);
        }
    },

    addToRepo: async (req, res) => {
        const factId = req.body.factId;
        const userId = req.user.id;

        try {
            const success = await factsService.addToRepo(factId, userId);

            if (success) {
                res.status(201).json({ message: "Facto guardado exitosamente." });
            } else {
                res.status(200).json({ message: "El facto ya se encuentra en el repositorio." });
            }
        } catch (err) {
            console.error("Error en el controlador al guardar facto: ", err.message);
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