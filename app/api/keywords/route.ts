import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const OLLAMA_API_URL = process.env.OLLAMA_BASE_URL!;

export async function OPTIONS() {
    return new Response(null, {
        status: 204,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
        },
    });
}

export async function POST(request: NextRequest) {
    try {
        const { description } = await request.json();
        
        const prompt = `Create themes as keywords (only one word) only separated by a comma for users to use from the following text:\n\n"${description}"\n\nKeywords:`;
        
        const response = await axios.post(`${OLLAMA_API_URL}/api/generate`, {
            model: 'mistral',
            prompt,
            stream: false,
        });
        
        return NextResponse.json({ keywords: response.data.response.trim() }, {
            headers: { "Access-Control-Allow-Origin": "*" }  // Allow all origins
        });
        
    } catch (error) {
        console.error(error);
    }
}
