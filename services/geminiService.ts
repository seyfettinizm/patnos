import { GoogleGenAI, Type } from "@google/genai";
import { RecommendationResponse } from "../types";

// Always use process.env.API_KEY directly as specified in the guidelines
export const getCulturalRecommendation = async (language: 'TR' | 'KU'): Promise<RecommendationResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Give me a unique Kurdish music recommendation related to Patnos/Ağrı or general Kurdish culture. 
               The response must be in JSON format. Language of context: ${language === 'TR' ? 'Turkish' : 'Kurdish'}.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          reason: { type: Type.STRING, description: "Why this song/artist is recommended." },
          suggestedArtist: { type: Type.STRING, description: "Name of the artist." },
          culturalContext: { type: Type.STRING, description: "Historical or cultural context of the music." }
        },
        required: ["reason", "suggestedArtist", "culturalContext"]
      }
    }
  });

  return JSON.parse(response.text.trim());
};

export const translateLyrics = async (text: string, targetLang: 'TR' | 'KU'): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Translate the following music lyrics to ${targetLang === 'TR' ? 'Turkish' : 'Kurdish (Kurmanji)'}. 
               Keep the poetic feeling. 
               Lyrics: ${text}`,
  });