import quizRepository from "../repositories/quizRepository.js";
import quizService from "../services/quizService.js";

//inicio de quiz
const startQuiz = async (req, res) => {
    try {
        //se lee la lista de excluidos del body (si es q existe)
        const { excludeIds } = req.body;
        const idsToExclude = Array.isArray(excludeIds) ? excludeIds : [];
        
        const questions = await quizService.generateQuiz(idsToExclude);

        if (!questions || questions.length === 0) {
            return res.status(404).json({ error: "No hay suficientes preguntas para jugar. ¡Creá algunos factos primero!" });
        }

        res.status(200).json(questions);
    } catch (error) {
        console.error("Error al iniciar el quiz:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

//verificacion de respuesta del usuario
const verifyAnswer = async (req, res) => {
    const { questionId, userAnswer } = req.body; 

    try {
        //busca la respuesta correcta en la bd
        const questionData = await quizRepository.getQuestionAnswer(questionId);
        
        if (!questionData) {
            return res.status(404).json({ error: "Pregunta no encontrada" });
        }

        //comparacion
        const isCorrect = questionData.correct_answer === userAnswer;
        
        res.status(200).json({ 
            correct: isCorrect, 
            explanation: questionData.explanation 
        });

    } catch (error) {
        console.error("Error verificando respuesta:", error);
        res.status(500).json({ error: "Error de servidor" });
    }
};

//actualizacion de puntaje
const updateScore = async (req, res) => {
    const { points } = req.body;
    
    const userId = req.user ? req.user.id : req.body.userId;

    if (!userId) {
        return res.status(401).json({ error: "Usuario no autenticado" });
    }

    try {
        const newScore = await quizRepository.updateUserPoints(userId, points);
        
        //devuelve el puntaje total acumulado
        res.status(200).json({ 
            message: "Puntaje actualizado", 
            score: newScore 
        });
    } catch (error) {
        console.error("Error actualizando puntaje:", error);
        res.status(500).json({ error: "Error de servidor" });
    }
};

//survival
//endpoint para procesar una respuesta en el survival
async function checkSurvivalAnswer(req, res) {
    //rachaActual es cuantas viene contestando bien
    //excludeIds es el array de idss que ya salieron para no repetir
    const { questionId, answer, rachaActual, excludeIds } = req.body;
    
    //obtenemos el id del usuario
    const userId = req.user ? req.user.id : req.body.userId; 

    try {
        if (!questionId) {
            const resultadoInicial = await quizService.processSurvivalAnswer(
                userId, 
                null, 
                null, 
                0, 
                excludeIds || []
            );
            return res.status(200).json(resultadoInicial);
        }

        //si ya hay una pregunta en juego, ahi si exigimos la respuesta para validar
        if (answer === undefined) {
            return res.status(400).json({ error: "Faltan datos obligatorios (answer)." });
        }

        //se llama al service
        const resultado = await quizService.processSurvivalAnswer(
            userId, 
            questionId, 
            answer, 
            parseInt(rachaActual) || 0, 
            excludeIds || []
        );

        //se devuelve el resultado al cliente
        return res.status(200).json(resultado);

    } catch (error) {
        console.error("Error en checkSurvivalAnswer:", error);
        return res.status(500).json({ error: "Error interno al procesar la racha." });
    }
}

export default {
    startQuiz,
    verifyAnswer,
    updateScore,
    checkSurvivalAnswer
};