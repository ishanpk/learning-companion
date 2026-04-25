import { GoogleGenAI, Type, Schema } from '@google/genai';
import { NextResponse } from 'next/server';

export const runtime = 'edge';


const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { scenario, userAction } = await req.json();

    const responseSchema: Schema = {
      type: Type.OBJECT,
      properties: {
        success: { type: Type.BOOLEAN, description: "Whether the user's action successfully resolves the scenario" },
        feedback: { type: Type.STRING, description: "Constructive feedback on the user's action" },
      },
      required: ["success", "feedback"],
    };

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Evaluate the user's action for the given broken system scenario.
      Scenario: ${scenario}
      User Action: ${userAction}
      Determine if the action successfully fixes the problem and provide feedback.`,
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
    console.error("Error checking scenario:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
