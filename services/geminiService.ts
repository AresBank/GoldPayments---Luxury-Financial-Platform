
import { GoogleGenAI } from "@google/genai";
import type { Transaction } from '../types';

// FIX: Aligned with Gemini API guidelines.
// The API key is sourced directly from process.env.API_KEY, and defensive checks are removed
// as per the guideline to assume the key is pre-configured and valid.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const callGemini = async (prompt: string, transactions: Transaction[]): Promise<string> => {
    const model = 'gemini-3-flash-preview';
    
    const transactionsContext = JSON.stringify(transactions.map(t => ({
        type: t.type,
        amount: t.amount,
        description: t.description,
        date: t.date.split('T')[0] // Only send date part for brevity
    })));

    const systemInstruction = `You are 'Aura', a professional and concise financial assistant for GoldPayments, a luxury fintech platform. Your tone is professional, helpful, and slightly formal. Analyze the user's transaction history to answer their questions. Keep your answers brief and to the point. Never mention that you are an AI or a language model. All monetary values are in MXN. Today's date is ${new Date().toISOString().split('T')[0]}.`;
    
    const fullPrompt = `Based on the following JSON transaction data, answer the user's question.
    
    Transactions:
    ${transactionsContext}
    
    User Question:
    "${prompt}"`;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: fullPrompt,
            config: {
                systemInstruction: systemInstruction,
                temperature: 0.3,
            }
        });

        if (response && response.text) {
            return response.text;
        }
        return "I'm sorry, I couldn't generate a response. Please try again.";

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        return "There was an error processing your request. Please check your connection or API key setup and try again.";
    }
};
