import {GoogleGenAI} from "@google/genai";

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

export {

    getIaFactVerdict

};