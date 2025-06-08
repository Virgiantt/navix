import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const { text, locale = 'en' } = await req.json();
    
    if (!text || typeof text !== 'string') {
      return Response.json({ error: 'Text is required' }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return Response.json({ error: 'TTS service unavailable' }, { status: 503 });
    }

    // Select appropriate voice based on locale and gender preference
    let voice = 'nova'; // Default female voice
    
    if (locale === 'en') {
      voice = 'nova'; // Natural, warm female voice
    } else if (locale === 'fr') {
      voice = 'shimmer'; // Good for French pronunciation
    } else if (locale === 'ar') {
      voice = 'alloy'; // Works well with Arabic
    }

    // Call OpenAI TTS API
    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'tts-1',
        input: text,
        voice: voice,
        response_format: 'mp3',
        speed: 1.0
      }),
    });

    if (!response.ok) {
      console.error('OpenAI TTS API error:', response.status);
      return Response.json({ error: 'TTS generation failed' }, { status: 500 });
    }

    const audioBuffer = await response.arrayBuffer();
    
    return new Response(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    });
  } catch (err) {
    console.error('TTS API error:', err);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}