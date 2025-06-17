import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const maxDuration = 30; // 30 seconds max execution time

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;
    const language = formData.get('language') as string || 'en-US';
    
    if (!audioFile) {
      return NextResponse.json({ error: 'No audio file provided' }, { status: 400 });
    }

    console.log('🎤 Processing audio:', audioFile.size, 'bytes, language:', language);

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error('Missing OPENAI_API_KEY for speech recognition');
      return NextResponse.json({ error: 'Speech recognition service unavailable' }, { status: 503 });
    }

    // Convert language codes for Whisper
    const whisperLanguageMap: { [key: string]: string } = {
      'en-US': 'en',
      'en': 'en',
      'fr-FR': 'fr', 
      'fr': 'fr',
      'ar-SA': 'ar',
      'ar': 'ar'
    };
    
    const whisperLanguage = whisperLanguageMap[language] || 'en';

    // Prepare form data for Whisper API
    const whisperFormData = new FormData();
    whisperFormData.append('file', audioFile);
    whisperFormData.append('model', 'whisper-1');
    whisperFormData.append('language', whisperLanguage);
    whisperFormData.append('response_format', 'json');
    whisperFormData.append('temperature', '0'); // More deterministic results

    console.log('🔄 Sending to Whisper API with language:', whisperLanguage);

    // Call OpenAI Whisper API with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.log('⏰ Whisper API timeout');
      controller.abort();
    }, 25000); // 25 second timeout

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
      const errorText = await whisperResponse.text();
      console.error('Whisper API error:', whisperResponse.status, errorText);
      return NextResponse.json({ 
        error: `Speech recognition failed: ${whisperResponse.status}`,
        details: errorText
      }, { status: 500 });
    }

    const whisperResult = await whisperResponse.json();
    console.log('✅ Whisper transcription:', whisperResult.text);
    
    // Return the transcription
    return NextResponse.json({ 
      transcript: whisperResult.text.trim(),
      confidence: 0.95, // Whisper is very accurate
      language: whisperLanguage,
      duration: audioFile.size // Rough estimate
    });

  } catch (error) {
    console.error('Speech-to-text error:', error);
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        console.log('🔊 Speech recognition request timeout');
        return NextResponse.json({ error: 'Speech recognition timeout' }, { status: 408 });
      }
    }
    
    return NextResponse.json({ 
      error: 'Speech recognition failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}