import * as factsRepository from "../Repositories/FactsRepository.js"

async function getAllFacts() {
    try {
        const facts = await factsRepository.getFactsAll();
        return facts; 
    } catch (err) {
        throw err;
    }
}

async function getFact(id) {
    try {
        const result = await factsRepository.getFactById(id);
        
        if (result && result.length > 0) {
            return result[0];
        }
        
        return null; 
        
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
        return facts;
    } catch (err) {
        throw err;
    }
}

async function getFactsByCategoryName(category) {
    // if (!category || typeof category !== 'string' || category.trim().length === 0) {
    //     throw new err("El nombre de la categoría no puede estar vacío.");
    // }
    try {
        const facts = await factsRepository.getFactsCategory(category);
        return facts;
    } catch (err) {
        throw err;
    }
}

async function createNewFact(factData) {
    if (!factData || !factData.title || !factData.content || !factData.category) {
        throw new Error("Datos de hecho incompletos o inválidos."); 
    }
    
    try {
        const success = await factsRepository.createFact(factData); 
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
        throw new err("ID de hecho no válido para eliminar.");
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
    updateExistingFact,
    deleteFactById
};