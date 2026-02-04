import cron from 'node-cron';
import db from '../config/db.js'; 
import { analyzeFact } from './Ia.js';

//funcion para arreglar los factos con veredicto roto
async function reintentarFactosFallidos() {
    console.log('[CRON] Iniciando reparacion de factos.');

    try {
        //
        //traemos los 5 factos mas viejos primero
        const querySelect = `
            SELECT * FROM facts 
            WHERE ia_responseverdict = 'Error' OR ia_responseverdict IS NULL OR ia_responseverdict = 'Pendiente'
            ORDER BY created_at ASC
            LIMIT 5; 
        `; 
        
        const { rows: factosFallidos } = await db.query(querySelect);

        //si no hay nada roto corta aca
        if (factosFallidos.length === 0) {
            return; 
        }

        console.log(`[CRON] Se encontraron ${factosFallidos.length} factos para reparar.`);

        //se procesa uno por uno
        for (const facto of factosFallidos) {
            try {
                console.log(`[CRON] Re-analizando Facto ID: ${facto.id}...`);

                //llamada a la ia
                const resultadoIA = await analyzeFact(facto.title, facto.content);
                
                //se verifica q la ia haya respondido bien
                if (resultadoIA && resultadoIA.verification && resultadoIA.verification.verdict !== 'Error') {
                    
                    //actualiza el facto
                    const queryUpdateFact = `
                        UPDATE facts 
                        SET ia_responseverdict = $1, ia_response = $2 
                        WHERE id = $3
                    `;
                    await db.query(queryUpdateFact, [
                        resultadoIA.verification.verdict, 
                        resultadoIA.verification.explanation, 
                        facto.id
                    ]);

                    //acomoda el quiz pero teniendo en cuenta que no haya duplicados por las dudas
                    if (resultadoIA.quiz) {
                        
                        //se verifica si ya existe
                        const checkQuery = `SELECT id FROM quiz_questions WHERE fact_id = $1`;
                        const { rows: existingQuestion } = await db.query(checkQuery, [facto.id]);

                        if (existingQuestion.length === 0) {
                            //si no existe, se inserta en quiz_questions
                            const queryInsertQuiz = `
                                INSERT INTO quiz_questions 
                                (fact_id, question_text, correct_answer, explanation, difficulty)
                                VALUES ($1, $2, $3, $4, $5)
                            `;
                            
                            await db.query(queryInsertQuiz, [
                                facto.id,
                                resultadoIA.quiz.question_text,
                                resultadoIA.quiz.correct_answer,
                                resultadoIA.quiz.explanation,
                                resultadoIA.quiz.difficulty
                            ]);

                        } else {
                        }
                    }

                    console.log(`[CRON] Facto ID ${facto.id} REPARADO.`);

                } else {
                    console.log(`[CRON] La IA fallo de nuevo para el ID ${facto.id}. Queda para la proxima vuelta.`);
                }

            } catch (err) {
                console.error(`[CRON] Error procesando ID ${facto.id}:`, err.message);
            }
            
            //pausa para no bloquear la api
            await new Promise(resolve => setTimeout(resolve, 2000));
        }

    } catch (error) {
        console.error('[CRON] Error general en el servicio:', error);
    }
}

//temporizador del servicio
export const iniciarCronJobs = () => {
    //va a correr cada 30 minutos
    cron.schedule('*/30 * * * *', () => {
        reintentarFactosFallidos();
    });

    console.log('[SERVICE] Cron Jobs iniciados (Reparación automática cada 30 mins).');
};