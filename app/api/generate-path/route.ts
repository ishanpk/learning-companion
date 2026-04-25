import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getAIModel, SchemaType } from '@/lib/ai';

/**
 * Global rate limit store (In-memory for prototype).
 */
const rateLimitMap = new Map<string, number>();

/**
 * Output Validation Schema.
 */
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

export async function POST(req: Request) {
  try {
    const { topic } = await req.json();
    
    // 1. Rate Limiting Logic
    const ip = req.headers.get('x-forwarded-for') || 'anon';
    const now = Date.now();
    if (now - (rateLimitMap.get(ip) || 0) < 12000) {
      return NextResponse.json({ error: "Rate limit exceeded. Please wait." }, { status: 429 });
    }
    rateLimitMap.set(ip, now);

    if (!topic) return NextResponse.json({ error: "No topic provided" }, { status: 400 });

    // 2. Define Response Schema for SDK
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
    };

    // 3. Generate Content using shared helper
    const model = getAIModel(responseSchema);
    const result = await model.generateContent(`Create a structured learning path for: "${topic}".`);
    const text = result.response.text();

    // 4. Validate and Return
    const data = courseSchema.parse(JSON.parse(text));
    return NextResponse.json(data);

  } catch (error: any) {
    console.error("[API] Generation Error:", error);
    const status = error instanceof z.ZodError ? 422 : 500;
    return NextResponse.json({ 
      error: "AI Generation Failed", 
      details: error.message 
    }, { status });
  }
}
