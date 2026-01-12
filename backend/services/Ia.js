import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

//se cargan las env
dotenv.config();

//se inicializa gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


/*obitene la verifiacion y la pregunta del quiz en una sola llamada, para ahorrar tokens.
se usa cuando el usuario CREA el facto.*/
async function analyzeFact(title, content) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash"  });
        const prompt = `
        Analiza el siguiente texto:
        Título: "${title}"
        Contenido: "${content}"

        TU TAREA (Responde ÚNICAMENTE con un JSON válido):

        1. VERIFICACIÓN:
            Genera un veredicto claro y conciso (máximo 300 caracteres), argumentando si crees que la información es verdadera o falsa.
            Expresalo como una opinión basada en argumentos.

        2. QUIZ:
            Genera una afirmación muy breve y clara para un juego de Verdadero o Falso basada en este tema.
            - 50% probabilidad de ser VERDADERA.
            - 50% probabilidad de ser FALSA (cambiando un dato clave).
            - Define la dificultad (easy, medium, hard).

        ESTRUCTURA JSON OBLIGATORIA:
        {
            "verification": {
                "verdict": "Verdadero" | "Falso" | "Impreciso",
                "explanation": "Aquí va el desarrollo de tus argumentos (lo que antes iba después del guion)"
            },
            "quiz": {
                "question_text": "Afirmación corta para el juego",
                "correct_answer": true, 
                "explanation": "Explicación breve",
                "difficulty": "medium"
            }
        }
        `;
        const result = await model.generateContent(prompt);
        const text = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();

        return JSON.parse(text);

    } catch(error) {
        console.error("Error al analizar el facto:", error);
        return {
            verification: {
                verdict: "Error", 
                explanation: "No se pudo conectar con la IA. Intente más tarde."
            },

        quiz: null
        };
    }
}

export { analyzeFact }