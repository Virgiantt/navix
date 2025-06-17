import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const maxDuration = 15; // REDUCED to 15 seconds for speed

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;
    const language = formData.get('language') as string || 'en-US';
    
    if (!audioFile) {
      return NextResponse.json({ error: 'No audio file provided' }, { status: 400 });
    }

    console.log('🚀 FAST Processing:', audioFile.size, 'bytes');

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error('Missing OPENAI_API_KEY');
      return NextResponse.json({ error: 'Service unavailable' }, { status: 503 });
    }

    // SPEED OPTIMIZATION: Skip very small files instantly
    if (audioFile.size < 500) {
      console.log('🔇 Audio too small, returning empty');
      return NextResponse.json({ transcript: '', confidence: 0 });
    }

    // ULTRA FAST language mapping - just use base language
    const whisperLanguage = language.split('-')[0]; // 'en', 'fr', 'ar'

    // Minimal form data for MAXIMUM SPEED
    const whisperFormData = new FormData();
    whisperFormData.append('file', audioFile);
    whisperFormData.append('model', 'whisper-1');
    whisperFormData.append('language', whisperLanguage);
    whisperFormData.append('response_format', 'json');
    whisperFormData.append('temperature', '0'); // Most deterministic = fastest

    console.log('⚡ INSTANT Whisper call...');

    // SPEED: Much shorter timeout for faster failures
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.log('⏰ API timeout');
      controller.abort();
    }, 12000); // REDUCED from 25 to 12 seconds

    const whisperResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
      body: whisperFormData,
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!whisperResponse.ok) {
      console.error('Whisper error:', whisperResponse.status);
      return NextResponse.json({ 
        error: 'Recognition failed'
      }, { status: 500 });
    }

    const whisperResult = await whisperResponse.json();
    console.log('⚡ INSTANT result:', whisperResult.text);
    
    // Return immediately with minimal payload
    return NextResponse.json({ 
      transcript: whisperResult.text.trim(),
      confidence: 0.95
    });

  } catch (error) {
    console.error('Speech error:', error);
    
    if (error instanceof Error && error.name === 'AbortError') {
      return NextResponse.json({ error: 'Timeout' }, { status: 408 });
    }
    
    return NextResponse.json({ error: 'Recognition failed' }, { status: 500 });
  }
}