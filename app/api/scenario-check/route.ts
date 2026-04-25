import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getAIModel, SchemaType } from '@/lib/ai';

const evaluationSchema = z.object({
  isCorrect: z.boolean(),
  explanation: z.string(),
  score: z.number().min(0).max(100),
});

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { solution, scenarioId } = await req.json();

    if (!solution) return NextResponse.json({ error: "No solution provided" }, { status: 400 });

    const responseSchema = {
      type: SchemaType.OBJECT,
      properties: {
        isCorrect: { type: SchemaType.BOOLEAN },
        explanation: { type: SchemaType.STRING },
        score: { type: SchemaType.NUMBER },
      },
      required: ["isCorrect", "explanation", "score"],
    };

    const model = getAIModel(responseSchema);
    const prompt = `Evaluate the software development solution for Scenario ID: ${scenarioId}.
    User Solution: "${solution}"
    Focus on best practices, efficiency, and edge cases.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    const data = evaluationSchema.parse(JSON.parse(text));
    return NextResponse.json(data);

  } catch (error: any) {
    console.error("[API] Scenario Error:", error);
    return NextResponse.json({ error: "Evaluation failed", details: error.message }, { status: 500 });
  }
}
