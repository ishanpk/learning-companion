import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { solution, scenarioId } = await req.json();

    if (!solution) {
      return NextResponse.json({ error: "No solution provided" }, { status: 400 });
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY!,
    });

    const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
      You are an expert code reviewer. A student has submitted a fix for a coding scenario.
      Scenario ID: ${scenarioId}
      User's Solution: "${solution}"
      
      Evaluate the solution. Is it correct? Provide a brief explanation and a score (0-100).
      Return as JSON: { "isCorrect": boolean, "explanation": string, "score": number }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const data = JSON.parse(response.text());

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("[API] Scenario Check Error:", error);
    return NextResponse.json({ error: "Evaluation failed", details: error.message }, { status: 500 });
  }
}
