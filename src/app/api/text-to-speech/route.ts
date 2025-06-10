import { NextRequest } from 'next/server';

export const runtime = 'nodejs'; // FIXED: Switch to Node.js runtime for better performance

export async function POST(req: NextRequest) {
  try {
    const { text, locale = 'en' } = await req.json();
    
    if (!text || typeof text !== 'string') {
      return Response.json({ error: 'Text is required' }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error('Missing OPENAI_API_KEY for TTS');
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

    console.log(`🔊 TTS API: Generating audio for "${text.substring(0, 50)}..." with voice: ${voice}`);

    // Call OpenAI TTS API with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.log('🔊 TTS API: OpenAI request timeout');
      controller.abort();
    }, 30000); // 30 second timeout for OpenAI API

    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'tts-1-hd', // IMPROVED: Use HD model for better quality
        input: text.slice(0, 4000), // SAFE: Limit text length to prevent long generation times
        voice: voice,
        response_format: 'mp3',
        speed: 1.1 // OPTIMIZED: Slightly faster speech for voice chat
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI TTS API error:', response.status, errorText);
      return Response.json({ error: `TTS generation failed: ${response.status}` }, { status: 500 });
    }

    const audioBuffer = await response.arrayBuffer();
    console.log(`🔊 TTS API: Generated audio buffer of ${audioBuffer.byteLength} bytes`);
    
    return new Response(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'public, max-age=1800', // 30 minutes cache
        'Content-Length': audioBuffer.byteLength.toString(),
      },
    });
  } catch (err) {
    console.error('TTS API error:', err);
    
    if (err instanceof Error) {
      if (err.name === 'AbortError') {
        console.log('🔊 TTS API: Request was aborted due to timeout');
        return Response.json({ error: 'TTS request timeout' }, { status: 408 });
      }
    }
    
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}