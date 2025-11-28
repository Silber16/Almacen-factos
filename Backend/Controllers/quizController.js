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
