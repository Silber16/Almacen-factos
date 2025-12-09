const quizService = require('../Services/quizService');

//obtener pregunta aleatoria
const obtenerPregunta = async (req, res) =>  {
    try {
        const pregunta = await quizService.obtenerPreguntaRandom();

        if (!pregunta) {
            return res.status(404).json({ error: 'No hay factos disponibles.' });
        }

        res.json(pregunta);

    } catch (error) {
        console.error('Error al obtener facto:', error);
        res.status(500).json({ error: 'Error del servidor.' });
    }
};

//valida la respuesta y asigna los puntos correspondientes al user
const validarRespuesta = async (req, res) => {
    try {
        const { factoId, textoMostrado, respuestaUsuario, userId } = req.body;

        const resultado = await quizService.validarYActualizarPuntos(
            factoId, 
            textoMostrado, 
            respuestaUsuario, 
            userId
        );
        
        res.json(resultado);
    } catch (error) {
        console.error('Error al validar respuesta:', error);
        res.status(500).json({ error: 'Error del servidor' });
    }
};

//obtener solo el puntaje sin validar respuesta
const obtenerPuntaje = async (req, res) => {
    try {
        const { userId } = req.params;
        const userPoints = await quizRepository.getUserPoints(userId);

        if (!userPoints || userPoints === 0) {
            return res.json({ puntajeTotal: 0 });
        }

        res.json({ puntajeTotal: userPoints[0].score });
    } catch (error) {
        console.error('Error al obtener puntaje:', error);
        res.status(500).json({ error: 'Error del servidor' });
    }
};

module.exports = {
    obtenerPregunta,
    validarRespuesta,
    obtenerPuntaje
};