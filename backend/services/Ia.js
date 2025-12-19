import * as iaRepository from "../repositories/Ia.js"

async function getIaFactVerdict(factContent) {

    try {
        const iaVerdict = await iaRepository.getIaFactVerdict(factContent);
        return iaVerdict; 
    } catch (err) {
        throw err;
    }
}

async function getQuizQuestion(factContent) {
    try {
        const question = await iaRepository.getQuizQuestion(factContent);
        return question; 
    } catch (err) {
        throw err;
    }
}

export { getIaFactVerdict, getQuizQuestion} 
