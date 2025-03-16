'use client';
import { useState } from 'react';

export default function Extract() {
    const [text, setText] = useState<string>('');
    const [keywords, setKeywords] = useState<string[]>([]);

    const handleExtract = async () => {
        if (text.length === 0) return;

        const res = await fetch('/api/keywords', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text }),
        });

        const data = await res.json();
        setKeywords(data.keywords.trim().split(', ').map((word: string) => word.trim()));
    };

    return (
        <div className="max-w-xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Keyword Extractor</h1>
            <textarea
                className="w-full p-2 border rounded mb-2"
                rows={6}
                placeholder="Enter text here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
            ></textarea>
            <button
                className="bg-blue-500 text-white py-2 px-4 rounded"
                onClick={handleExtract}
            >
                Extract Keywords
            </button>
            {keywords && keywords.map((keyword: string, index: number) => (
                <div className="mt-4" key={index}>
                    <h2 className="font-semibold">Keywords:</h2>
                    <p>{keyword}</p>
                </div>
            ))}
        </div>
    );
}