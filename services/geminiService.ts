
import { GoogleGenAI } from "@google/genai";

// Fix: Strictly follow guidelines for API key initialization
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getBusinessInsights = async (data: any) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analise os seguintes dados do meu bar e forneça 3 dicas práticas de gestão (vendas, estoque ou fidelização).
      Dados: ${JSON.stringify(data)}
      Retorne em português, formato Markdown, seja conciso.`,
      config: {
        thinkingConfig: { thinkingBudget: 0 }
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Não foi possível carregar insights no momento.";
  }
};
