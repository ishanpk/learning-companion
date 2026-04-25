import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

    const responseSchema = {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          id: { type: SchemaType.STRING },
          title: { type: SchemaType.STRING },
          description: { type: SchemaType.STRING },
          difficulty: { type: SchemaType.STRING },
          estimatedHours: { type: SchemaType.NUMBER },
          skills: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
          icon: { type: SchemaType.STRING },
          gradient: { type: SchemaType.STRING },
        },
        required: ['id', 'title', 'description', 'difficulty', 'estimatedHours', 'skills', 'icon', 'gradient'],
      },
    } as any;

    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: responseSchema,
      },
    });

    const result = await model.generateContent('Generate exactly 3 diverse software development capstone projects.');
    const response = await result.response;
    const projects = JSON.parse(response.text());

    return NextResponse.json({ projects });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
