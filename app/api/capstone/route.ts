import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini
const apiKey = process.env.GEMINI_API_KEY || 'AIzaSyCwmEBt-Aij0NwTuqqCp5gzz9R3O8VvjnQ';
const genAI = new GoogleGenerativeAI(apiKey);

export async function GET() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `Generate exactly 3 diverse software development capstone projects for a student.
    Return ONLY a JSON array of objects with the following schema:
    [
      {
        "id": "unique string",
        "title": "Project Title",
        "description": "2-3 sentences describing the project.",
        "difficulty": "Beginner" | "Intermediate" | "Advanced",
        "estimatedHours": number,
        "skills": ["Skill 1", "Skill 2", "Skill 3"],
        "icon": "A single relevant emoji",
        "gradient": "One of: from-primary to-accent, from-accent to-teal-400, from-purple-500 to-primary, from-orange-400 to-red-500, from-blue-400 to-cyan-400"
      }
    ]
    Do not wrap in Markdown. Output raw JSON array only.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim().replace(/```json/g, '').replace(/```/g, '').trim();
    
    const projects = JSON.parse(text);
    return NextResponse.json({ projects });
  } catch (error) {
    console.error('Error generating capstone projects:', error);
    return NextResponse.json({ error: 'Failed to generate projects' }, { status: 500 });
  }
}
