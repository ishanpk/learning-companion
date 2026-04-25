import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import { NextResponse } from 'next/server';
import { z } from 'zod';

// Phase 3 Schema: Ensure the AI output perfectly matches our store's expectations
const courseSchema = z.object({
  courseTitle: z.string().min(3),
  modules: z.array(z.object({
    title: z.string().min(1),
    description: z.string().min(5),
    content: z.string().min(20),
    quiz: z.array(z.object({
      question: z.string().min(5),
      options: z.array(z.string()).length(4),
      correctAnswer: z.string().min(1),
    })).min(1),
  })).min(1),
});

export const dynamic = 'force-dynamic';

const rateLimitMap = new Map<string, number>();

export async function POST(req: Request) {
  try {
    const { topic } = await req.json();
    
    // Basic Rate Limiting
    const ip = req.headers.get('x-forwarded-for') || 'anon';
    const now = Date.now();
    const lastRequest = rateLimitMap.get(ip) || 0;
    if (now - lastRequest < 12000) {
      return NextResponse.json({ error: "Rate limit exceeded." }, { status: 429 });
    }
    rateLimitMap.set(ip, now);

    if (!topic) return NextResponse.json({ error: "No topic provided" }, { status: 400 });

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

    const responseSchema = {
      type: SchemaType.OBJECT,
      properties: {
        courseTitle: { type: SchemaType.STRING },
        modules: {
          type: SchemaType.ARRAY,
          items: {
            type: SchemaType.OBJECT,
            properties: {
              title: { type: SchemaType.STRING },
              description: { type: SchemaType.STRING },
              content: { type: SchemaType.STRING },
              quiz: {
                type: SchemaType.ARRAY,
                items: {
                  type: SchemaType.OBJECT,
                  properties: {
                    question: { type: SchemaType.STRING },
                    options: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
                    correctAnswer: { type: SchemaType.STRING },
                  },
                  required: ["question", "options", "correctAnswer"],
                },
              },
            },
            required: ["title", "description", "content", "quiz"],
          },
        },
      },
      required: ["courseTitle", "modules"],
    } as any;

    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: responseSchema,
      },
    });

    const result = await model.generateContent(`Create a learning path for: "${topic}".`);
    const response = await result.response;
    const text = response.text();

    const data = JSON.parse(text);
    const validatedData = courseSchema.parse(data);

    return NextResponse.json(validatedData);

  } catch (error: any) {
    console.error("[API] Error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation Failed", details: error.errors }, { status: 422 });
    }
    return NextResponse.json({ error: "AI Failed", details: error.message }, { status: 500 });
  }
}
