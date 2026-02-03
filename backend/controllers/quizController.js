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

export default {
    startQuiz,
    verifyAnswer,
    updateScore
};