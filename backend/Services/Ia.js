import * as iaRepository from "../Repositories/Ia.js"

async function getIaFactVerdict(factContent) {

    try {
        const iaVerdict = await iaRepository.getIaFactVerdict(factContent);
        return iaVerdict; 
    } catch (err) {
        throw err;
    }
}

export { getIaFactVerdict} 
