import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: NextRequest) {
    const { description } = await request.json();

    const prompt = `Create themes as keywords (only one word) only separated by a comma for users to use from the following text:\n\n"${description}"\n\nKeywords:`;

    const response = await axios.post('http://localhost:11434/api/generate', {
        model: 'mistral',
        prompt,
        stream: false,
    });

    const keywords = response.data.response.trim();

    return NextResponse.json({ keywords });
}