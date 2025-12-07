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

        //objeto que se envia al controlador
        return {
            factoId: facto.id,
            texto: textoMostrado,
            tiempoLimite: 30
        };

    } catch (err) {
        throw err;
    }
}



async function validarYActualizarPuntos(factoId, textoMostrado, respuestaUsuario, userId) {
    //validar parametros
    if (!factoId || isNaN(Number(factoId))) {
        throw new Error("ID de facto no valido.");
    }
    if (!userId || isNaN(Number(userId))) {
        throw new Error("ID de usuario no valido.");
    }


    try {
        //buscar el facto
        const facts = await quizRepository.getFactById(factoId);

        if (!facts || facts.length === 0) {
            throw new Error("Facto no encontrado.");
        }
        const facto = facts[0];


        //determinar respuesta correcta
        let respuestaCorrecta;

        if (textoMostrado === facto.contenido) {
            respuestaCorrecta = true;
        } else if (textoMostrado === facto.contenido_modificado) {
            respuestaCorrecta = false;
        } else {
            throw new Error("El texto mostrado no coincide con ningun facto.");
        }

    } catch(err) {
        throw err;
    }
}
