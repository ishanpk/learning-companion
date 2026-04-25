import { GoogleGenAI, Type, Schema } from '@google/genai';
import { NextResponse } from 'next/server';

// Phase 2: Switch to Edge Runtime for faster TTFB and lower cold starts
export const runtime = 'edge';
export const dynamic = 'force-dynamic';

/**
 * Simple in-memory rate limiting for the Edge runtime (per region)
 */
const rateLimitMap = new Map<string, number>();

export async function POST(req: Request) {
  try {
    const { topic } = await req.json();
    
    // Basic Rate Limiting: 5 requests per minute per IP
    const ip = req.headers.get('x-forwarded-for') || 'anon';
    const now = Date.now();
    const lastRequest = rateLimitMap.get(ip) || 0;
    if (now - lastRequest < 12000) { // 12 seconds between requests
      return NextResponse.json({ error: "Rate limit exceeded. Please wait a few seconds." }, { status: 429 });
    }
    rateLimitMap.set(ip, now);

    if (!topic || topic.length < 2) {
      return NextResponse.json({ error: "Invalid topic provided." }, { status: 400 });
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY!,
    });

    console.log(`[API] Generating path for topic: ${topic}`);

    const responseSchema: Schema = {
      type: Type.OBJECT,
      properties: {
        courseTitle: {
          type: Type.STRING,
          description: "The title of the generated course",
        },
        modules: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              content: { type: Type.STRING, description: "Markdown content for the module" },
              quiz: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    question: { type: Type.STRING },
                    options: { type: Type.ARRAY, items: { type: Type.STRING } },
                    correctAnswer: { type: Type.STRING },
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

    const model = ai.getGenerativeModel({
      model: 'gemini-1.5-flash', // Using latest stable model name
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: responseSchema,
      },
    });

    const result = await model.generateContent(`Create a comprehensive learning path and detailed course modules for the topic: "${topic}".`);
    const response = await result.response;
    const text = response.text();

    if (!text) {
      throw new Error("Gemini returned an empty response.");
    }

    const data = JSON.parse(text);
    return NextResponse.json(data);

  } catch (error: any) {
    console.error("[API] Error generating path:", error);
    
    // Phase 2: Structured error handling
    const status = error.message?.includes("Rate limit") ? 429 : 500;
    return NextResponse.json({ 
      error: "AI Generation Failed", 
      details: error.message,
      suggestion: "Try a more specific topic or check your internet connection."
    }, { status });
  }
}
