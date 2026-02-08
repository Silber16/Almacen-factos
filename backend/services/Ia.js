import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
import path from 'path';
import { readFile } from 'node:fs/promises';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/*obitene la verifiacion y la pregunta del quiz en una sola llamada, para ahorrar tokens.
se usa cuando el usuario CREA el facto.*/
async function analyzeFact(title, content) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash"  });
        const prompt = await processPrompt(title, content);
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

async function processPrompt(title, content){
    const promptPath = path.join(process.cwd(), 'resources', 'prompts', 'promptTemplate.txt');
    const promptTemplate = await readFile(promptPath, 'utf-8');

    const prompt = promptTemplate
        .replace('{title}', title)
        .replace('{content}', content);

    return prompt;
}

export { analyzeFact }