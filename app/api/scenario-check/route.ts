import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { solution, scenarioId } = await req.json();

    if (!solution) return NextResponse.json({ error: "No solution provided" }, { status: 400 });

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
      Evaluate the solution for Scenario ${scenarioId}.
      Solution: "${solution}"
      Return as JSON: { "isCorrect": boolean, "explanation": string, "score": number }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const data = JSON.parse(response.text());

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: "Failed", details: error.message }, { status: 500 });
  }
}
