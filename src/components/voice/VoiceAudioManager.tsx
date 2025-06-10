"use client";

import { useCallback, useRef } from "react";

interface VoiceAudioManagerProps {
  locale: string;
  onSpeakingStart: () => void;
  onSpeakingEnd: () => void;
  onRestartListening: () => void;
}

export default function useVoiceAudioManager({
  locale,
  onSpeakingStart,
  onSpeakingEnd,
  onRestartListening
}: VoiceAudioManagerProps) {
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  const speakWithElevenLabs = useCallback(async (text: string, isGoodbye: boolean = false) => {
    try {
      console.log('🔊 Starting OpenAI TTS with text:', text.substring(0, 50) + '...');
      onSpeakingStart();
      
      const baseUrl = window.location.origin;
      const ttsApiUrl = `${baseUrl}/api/text-to-speech`;
      
      console.log('🔊 Making TTS API request to:', ttsApiUrl);
      
      // Add AbortController for timeout - but longer timeout for better reliability
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        console.log('🔊 TTS API timeout - aborting request');
        controller.abort();
      }, 15000); // 15 second timeout - more generous
      
      const response = await fetch(ttsApiUrl, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        },
        body: JSON.stringify({
          text: text,
          locale: locale
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      console.log('🔊 TTS API response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('🔊 TTS API error response:', errorText);
        throw new Error(`TTS API error: ${response.status} - ${errorText}`);
      }

      const audioBlob = await response.blob();
      console.log('🔊 Audio blob received, size:', audioBlob.size, 'bytes');
      
      if (audioBlob.size === 0) {
        throw new Error('Empty audio blob received');
      }
      
      const audioUrl = URL.createObjectURL(audioBlob);
      console.log('🔊 Audio URL created:', audioUrl);
      
      currentAudioRef.current = new Audio(audioUrl);
      console.log('🔊 Audio element created');
      
      return new Promise<void>((resolve) => {
        if (!currentAudioRef.current) {
          console.log('🔊 No audio element, resolving immediately');
          onSpeakingEnd();
          resolve();
          if (!isGoodbye) {
            setTimeout(() => onRestartListening(), 500);
          }
          return;
        }

        // Add audio timeout - more generous for longer responses
        const audioTimeoutId = setTimeout(() => {
          console.log('🔊 Audio playback timeout');
          onSpeakingEnd();
          URL.revokeObjectURL(audioUrl);
          if (!isGoodbye) {
            setTimeout(() => onRestartListening(), 1000);
          }
          resolve();
        }, 45000); // 45 second audio timeout for longer responses

        currentAudioRef.current.onended = () => {
          console.log('🔊 Audio playback ended - isGoodbye:', isGoodbye);
          clearTimeout(audioTimeoutId);
          onSpeakingEnd();
          URL.revokeObjectURL(audioUrl);
          resolve();
          
          if (!isGoodbye) {
            console.log('🎤 TRIGGERING AUTO-RESTART FROM AUDIO END');
            setTimeout(() => onRestartListening(), 800);
          }
        };
        
        currentAudioRef.current.onerror = (error) => {
          console.error('🔊 Audio playback error:', error);
          clearTimeout(audioTimeoutId);
          onSpeakingEnd();
          URL.revokeObjectURL(audioUrl);
          
          if (!isGoodbye) {
            console.log('🎤 TRIGGERING AUTO-RESTART FROM AUDIO ERROR');
            setTimeout(() => onRestartListening(), 1000);
          }
          resolve();
        };

        currentAudioRef.current.onloadstart = () => {
          console.log('🔊 Audio loading started');
        };

        currentAudioRef.current.oncanplay = () => {
          console.log('🔊 Audio can play');
        };

        currentAudioRef.current.onplay = () => {
          console.log('🔊 Audio playback started');
        };
        
        console.log('🔊 Attempting to play audio...');
        currentAudioRef.current.play().catch((error) => {
          console.error('🔊 Audio play failed:', error);
          console.log('🔊 Audio play error details:', {
            name: error.name,
            message: error.message,
            code: error.code
          });
          
          clearTimeout(audioTimeoutId);
          onSpeakingEnd();
          URL.revokeObjectURL(audioUrl);
          
          if (!isGoodbye) {
            console.log('🎤 TRIGGERING AUTO-RESTART FROM PLAY FAILURE');
            setTimeout(() => onRestartListening(), 1000);
          }
          resolve();
        });
      });
      
    } catch (error) {
      console.error('🔊 TTS error:', error);
      onSpeakingEnd();
      
      // NO FALLBACK - just restart listening if not goodbye
      if (!isGoodbye) {
        console.log('🎤 TRIGGERING AUTO-RESTART FROM TTS ERROR');
        setTimeout(() => onRestartListening(), 2000);
      }
    }
  }, [locale, onSpeakingStart, onSpeakingEnd, onRestartListening]);

  const stopSpeaking = useCallback(() => {
    console.log('🛑 Stopping speaking...');
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.currentTime = 0;
      currentAudioRef.current = null;
    }
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    onSpeakingEnd();
  }, [onSpeakingEnd]);

  const cleanup = useCallback(() => {
    console.log('🧹 Cleaning up audio...');
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.currentTime = 0;
      currentAudioRef.current = null;
    }
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    onSpeakingEnd();
  }, [onSpeakingEnd]);

  return {
    speakWithElevenLabs,
    stopSpeaking,
    cleanup
  };
}