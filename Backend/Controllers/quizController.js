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
        console.error('Error al obtener pregunta:', error);
        res.status(500).json({ error: 'Error del servidor.' });
    }
};

//valida la respuesta y asigna los puntos correspondientes al user
const validarRespuesta = async (req, res) => {
    try {
        const { factId, textoMostrado, respuestaUsuario, userId } = req.body;
        
        const resultado = await quizService.validarYActualizarPuntos(
            factId, 
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

module.exports = {
    obtenerPregunta,
    validarRespuesta
};