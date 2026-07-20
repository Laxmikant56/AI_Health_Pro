import { GoogleGenAI } from "@google/genai";
import { IR_COEFFICIENTS } from "../data/constants";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

if (!process.env.GEMINI_API_KEY) {
  console.warn("GEMINI_API_KEY is missing. AI features will not work in production unless set via environment variables.");
}

export interface IRPredictionInput {
  age: number;
  isMale: boolean;
  thumbValue: number;
  indexValue: number;
  isPostMeal: boolean;
}

export const predictGlucose = (input: IRPredictionInput): number => {
  const { age, isMale, thumbValue, indexValue, isPostMeal } = input;
  const rawValue = 
    IR_COEFFICIENTS.intercept + 
    (IR_COEFFICIENTS.age * age) + 
    (IR_COEFFICIENTS.gender * (isMale ? 1 : 0)) +
    (IR_COEFFICIENTS.thumb * thumbValue) + 
    (IR_COEFFICIENTS.index * indexValue) + 
    (IR_COEFFICIENTS.meal * (isPostMeal ? 1 : 0));
  
  // Clamping to realistic ranges
  return Math.max(70, Math.min(300, rawValue));
};

export const getGlucoseStatus = (value: number, isPostMeal: boolean) => {
  if (isPostMeal) {
    if (value < 140) return { label: 'Normal', color: 'text-green-600', bg: 'bg-green-100' };
    if (value < 200) return { label: 'Prediabetic', color: 'text-orange-600', bg: 'bg-orange-100' };
    return { label: 'Diabetic', color: 'text-red-600', bg: 'bg-red-100' };
  } else {
    if (value < 100) return { label: 'Normal', color: 'text-green-600', bg: 'bg-green-100' };
    if (value < 126) return { label: 'Prediabetic', color: 'text-orange-600', bg: 'bg-orange-100' };
    return { label: 'Diabetic', color: 'text-red-600', bg: 'bg-red-100' };
  }
};

export const generateAIPLAN = async (prompt: string) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("Gemini API Key is missing.");
    return null;
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("AI Generation Error:", error);
    return null;
  }
};
