import { GoogleGenAI, Type, Schema } from '@google/genai';
import { NextResponse } from 'next/server';

export const runtime = 'edge';


const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { topic } = await req.json();

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

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Create a learning path and course modules for the topic: "${topic}".`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: responseSchema,
      },
    });

    if (!response.text) {
      throw new Error("No text generated.");
    }

    const data = JSON.parse(response.text);
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error generating path:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
