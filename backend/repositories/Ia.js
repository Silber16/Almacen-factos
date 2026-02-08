import {GoogleGenAI} from "@google/genai";
import fs from 'fs/promises'; 
import path from 'path';

const MODEL =  "gemini-2.5-flash";
const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});;

async function getIaFactVerdict(prompt) {
    try {
        const response = await ai.models.generateContent({
            model: MODEL,
            contents: prompt
        });
        return response.text;

    } catch (err) {
        console.error('Error con Gemini:', err);
        throw err;
    }
}


async function getQuizQuestion(factContent) {
    try {
        //busca el prompt
        const promptPath = path.resolve("./resources/quizPrompt.txt");
        let promptTemplate = await fs.readFile(promptPath, 'utf-8');
        
        const finalPrompt = promptTemplate.replace('{{factContent}}', factContent);
        
        const resultText = await getIaFactVerdict(finalPrompt);
        
        //se limpia y se parsea
        const cleanJson = resultText.replace(/```json|```/g, "").trim();
        return JSON.parse(cleanJson);
        
    } catch (err) {
        console.error('Error al generar pregunta de Quiz en Repo:', err);
        throw err;
    }
}

export {

    getIaFactVerdict,
    getQuizQuestion

};