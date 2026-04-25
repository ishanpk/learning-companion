import { GoogleGenAI, Type, Schema } from '@google/genai';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY!,
    });

    const responseSchema: Schema = {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          difficulty: { type: Type.STRING, description: 'One of: Beginner, Intermediate, Advanced' },
          estimatedHours: { type: Type.NUMBER },
          skills: { type: Type.ARRAY, items: { type: Type.STRING } },
          icon: { type: Type.STRING, description: 'A single relevant emoji' },
          gradient: { type: Type.STRING, description: 'Tailwind gradient class' },
        },
        required: ['id', 'title', 'description', 'difficulty', 'estimatedHours', 'skills', 'icon', 'gradient'],
      },
    };

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: 'Generate exactly 3 diverse software development capstone projects for a student. Include a mix of difficulty levels.',
      config: {
        responseMimeType: 'application/json',
        responseSchema: responseSchema,
      },
    });

    if (!response.text) {
      throw new Error('No text generated.');
    }

    const projects = JSON.parse(response.text);
    return NextResponse.json({ projects });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to generate projects';
    console.error('Error generating capstone projects:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
