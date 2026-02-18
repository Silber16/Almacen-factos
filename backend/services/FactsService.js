import * as factsRepository from "../repositories/FactsRepository.js"
import * as userRepository from "../repositories/user.js"
import Facts from "../models/Facts.js";

async function getAllFacts(limit, offset) {
    try {
        const facts = await factsRepository.getFactsAll(limit, offset);
        return facts.map(fact => new Facts({
            id: fact.id,
            title: fact.title,
            content: fact.content,
            font: fact.font,
            category: fact.category,
            createdBy: fact.created_by,
            userName: fact.username,
            iaResponse: fact.ia_response,
            iaVerdict: fact.ia_responseverdict
            }));;
    } catch (err) {
        throw err;
    }
}

async function getFact(id) {
    try {
        const result = await factsRepository.getFactById(id);

        if (!result || result.length === 0) return null;

        const fact = result[0];

        return new Facts({
            id: fact.id,
            title: fact.title,
            content: fact.content,
            font: fact.font,
            category: fact.category,
            createdBy: fact.created_by,
            userName: fact.username,
            iaResponse: fact.ia_response,
            iaVerdict: fact.ia_responseverdict
        });
    } catch (err) {
        throw err;
    }
}

async function getFactsByUser(userId) {
    if (!userId || isNaN(Number(userId))) {
        throw new err("ID de usuario no válido.");
    }
    try {
        const facts = await factsRepository.getFactsByUserId(userId);

        return facts.map(fact => new Facts({
            id: fact.id,
            title: fact.title,
            content: fact.content,
            font: fact.font,
            category: fact.category,
            createdBy: fact.created_by,
            userName: fact.username,
            iaResponse: fact.ia_response,
            iaVerdict: fact.ia_responseverdict
            }));;
    } catch (err) {
        throw err;
    }
}

async function getFactsByCategoryName(category) {
    if (!category || typeof category !== 'string' || category.trim().length === 0) {
        throw new err("El parametro de categoria no es valido.");
    }

    try {
        const facts = await factsRepository.getFactsCategory(category);
        
        return facts.map(fact => new Facts({
            id: fact.id,
            title: fact.title,
            content: fact.content,
            font: fact.font,
            category: fact.category,
            createdBy: fact.created_by,
            userName: fact.username,
            iaResponse: fact.ia_response,
            iaVerdict: fact.ia_responseverdict   
        }));
    } catch (err) {
        throw err;
    }
}

async function createNewFact(factData) {
    if (!factData || !factData.title || !factData.content || !factData.category) {
        throw new Error("Datos de fact incompletos o inválidos."); 
    }

    let factScore = 0
    switch (factData.ia_responseverdict) {
        case "V":
            factScore = 3;
            break;
        case "F":
            factScore = -3;
            break;
        default:
            factScore = 0;
            break;
    }

    try {
        
        if (factScore != 0)
            await userRepository.updateScore(factScore, factData.createdBy);

        const fact = new Facts({
            id: 0,
            title: factData.title,
            content: factData.content,
            font: factData.font,
            category: factData.category,
            createdBy: factData.createdBy,
            iaResponse: factData.iaResponse || factData.ia_response,
            iaVerdict: factData.iaVerdict || factData.ia_responseverdict
            });

        const createdFact = await factsRepository.createFact(fact); 
        return createdFact;
    } catch (err) {
        throw err;
    }
}

async function addToRepo(factId, userId) {
    if (!factId || !userId) {
        throw new Error("Datos de fact incompletos o inválidos."); 
    }
    
    try {
        const success = await factsRepository.addToRepo(factId, userId); 
        return success;

    } catch (err) {
        throw err;
    }
}

async function updateExistingFact(factData) {
    if (!factData || !factData.id || isNaN(Number(factData.id))) {
        throw new err("Se requiere un ID válido para la actualización."); 
    }
    
    if (!factData.title && !factData.text && !factData.category) {
        throw new err("Debe proporcionar al menos un campo para actualizar."); 
    }
    
    try {
        const success = await factsRepository.updateFact(factData);
        return success;

    } catch (err) {
        throw err;
    }
}

async function deleteFactById(id) {
    if (!id || isNaN(Number(id))) {
        throw new err("ID de fact no válido para eliminar.");
    }
    
    try {
        const success = await factsRepository.deleteFact(id);
        return success;

    } catch (err) {
        throw err;
    }
}

export {
    getAllFacts,
    getFact,
    getFactsByUser,
    getFactsByCategoryName,
    createNewFact,
    addToRepo,
    updateExistingFact,
    deleteFactById
};