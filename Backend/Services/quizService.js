const quizRepository = require('../Repositories/quizRepository');


//traer facto
async function obtenerPreguntaRandom() {
    try {
        const facts = await quizRepository.getRandomFact();
        
        if (!facts || facts.length === 0) {
            return null;
        }
        
        const facto = facts[0];

        //aca se elige aleatoriamente 50/50 si mostrar el facto verdadero o el falso
        const mostrarModificado = Math.random() < 0.5;

        //si el numero que salio es mayor a 0.5 se muestra el original
        //si el numero que salio es menor a 0.5 se muestra el modificado
        let textoMostrado;
        if (mostrarModificado) {
            textoMostrado = facto.contenido_modificado;
        } else {
            textoMostrado = facto.contenido
        }
    }
}