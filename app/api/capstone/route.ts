import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getAIModel, SchemaType } from '@/lib/ai';

const projectSchema = z.object({
  projects: z.array(z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    difficulty: z.string(),
    estimatedHours: z.number(),
    skills: z.array(z.string()),
    icon: z.string(),
    gradient: z.string(),
  })).length(3),
});

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
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
    };

    const model = getAIModel(responseSchema);
    const result = await model.generateContent('Generate exactly 3 diverse software development capstone projects.');
    const text = result.response.text();

    const data = projectSchema.parse({ projects: JSON.parse(text) });
    return NextResponse.json(data);

  } catch (error: any) {
    console.error("[API] Capstone Error:", error);
    return NextResponse.json({ error: "Failed to generate projects", details: error.message }, { status: 500 });
  }
}
