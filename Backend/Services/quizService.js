const quizRepository = require('../Repositories/quizRepository');

async function obtenerPreguntaRandom() {
    try {
        const facts = await quizRepository.getRandomFact();
        
        if (!facts || facts.length === 0) {
            return null;
        } 
    }
}