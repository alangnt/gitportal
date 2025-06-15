import { NextRequest, NextResponse } from 'next/server';
import { Groq } from 'groq-sdk';

export async function POST(request: NextRequest) {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const { description } = await request.json();
    
    if (!description || description.length <= 0) return NextResponse.json({ message: '' });

    const prompt = `Create themes as keywords (only one word) only separated by a comma for users to use from the following text:\n\n"${description}"\n\nKeywords:`;

    const response = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
            { role: "user", content: prompt }
        ]
    });

    if (response) {
        return NextResponse.json({ message: response.choices[0].message.content });
    }
    return NextResponse.json({ message: null }, { status: 500 });
}
