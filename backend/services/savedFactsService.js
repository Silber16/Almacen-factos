import * as savedFactsRepo from '../repositories/savedFactsRepository.js';

export const toggleSaveFact = async (userId, factId) => {
    //se verifica si ya existe
    const isSaved = await savedFactsRepo.isFactSaved(userId, factId);
    
    if (isSaved) {
        //si existe se borra
        await savedFactsRepo.unsaveFact(userId, factId);
        return { saved: false, message: "Eliminado de tus guardados" };
    } else {
        //si no existe se guarda
        await savedFactsRepo.saveFact(userId, factId);
        return { saved: true, message: "Guardado en tu colección" };
    }
};

export const getMySavedFacts = async (userId) => {
    return await savedFactsRepo.getSavedFactsByUser(userId);
};