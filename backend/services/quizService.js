import quizRepository from '../repositories/quizRepository.js';


//traer facto
async function obtenerPreguntaRandom() {
    try {
        const facto = await quizRepository.getRandomFact();
        
        if (!facto) {
            return null;
        }
        //aca se elige aleatoriamente 50/50 si mostrar el facto verdadero o el falso
        const mostrarModificado = Math.random() < 0.5;
        //si el numero que salio es mayor a 0.5 se muestra el original
        //si el numero que salio es menor a 0.5 se muestra el modificado
        let textoMostrado;
        if (mostrarModificado) {
            textoMostrado = facto.modified_content;
        } else {
            textoMostrado = facto.content;
        }

        //objeto que se envia al controlador
        return {
            id: facto.id,
            modified_content: textoMostrado,
            tiempoLimite: 30,
            font: facto.font
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

        if (textoMostrado === facto.content) {
            respuestaCorrecta = true;
        } else if (textoMostrado === facto.modified_content) {
            respuestaCorrecta = false;
        } else {
            throw new Error("El texto mostrado no coincide con ningun facto.");
        }

        //verificar respusta del usuario
        let respondioCorrectamente;
        let puntosGanados;

        if (respuestaUsuario === respuestaCorrecta) {
            respondioCorrectamente = true;
            puntosGanados = 10;
        } else {
            respondioCorrectamente = false;
            puntosGanados = 0;
        }

        //actualizar puntos
        await quizRepository.updateUserPoints(userId, puntosGanados);

        
        //obtener puntaje total
        const userPoints = await quizRepository.getUserPoints(userId);
        
        if (!userPoints || userPoints.length === 0) {
            throw new Error('Usuario no encontrado');
        }

        const puntajeTotal = userPoints[0].score;

        return {
            correcto: respondioCorrectamente,
            puntosGanados,
            puntajeTotal,
            respuestaCorrecta: respuestaCorrecta
        };

    } catch(err) {
        throw err;
    }
}

export default {
    obtenerPreguntaRandom,
    validarYActualizarPuntos
};