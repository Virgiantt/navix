"use client";

import { useRef, useCallback, useState, useEffect } from 'react';

interface WebRTCVoiceManagerProps {
  locale: string;
  isEnding: boolean;
  isSpeaking: boolean;
  conversationActive: boolean;
  onListeningStart: () => void;
  onListeningEnd: () => void;
  onTranscript: (transcript: string) => void;
  onError: (error: string) => void;
  onAudioLevel: (level: number) => void;
  onAudioProcessing?: (isProcessing: boolean) => void; // NEW: Audio processing callback
}

export default function useWebRTCVoiceManager({
  locale,
  isEnding,
  isSpeaking,
  conversationActive,
  onListeningStart,
  onListeningEnd,
  onTranscript,
  onError,
  onAudioLevel,
  onAudioProcessing
}: WebRTCVoiceManagerProps) {
  
  // CLEANED UP REFS - Only essential ones
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const isRecordingRef = useRef(false);
  const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number>(0);
  const processingRef = useRef(false);

  // SIMPLIFIED STATES - Only what we need
  const [isListening, setIsListening] = useState(false);

  // Audio level monitoring for visual feedback
  const startAudioVisualization = useCallback(() => {
    if (!analyserRef.current) return;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const updateAudioLevel = () => {
      if (!analyserRef.current || !isRecordingRef.current) return;
      
      try {
        analyserRef.current.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((sum, value) => sum + value, 0) / bufferLength;
        const normalizedLevel = Math.min(average / 128, 1);
        
        onAudioLevel(normalizedLevel);
        
        if (isRecordingRef.current) {
          animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
        }
      } catch (error) {
        console.log('Audio visualization error:', error);
      }
    };
    
    updateAudioLevel();
  }, [onAudioLevel]);

  const startListening = useCallback(async () => {
    if (isRecordingRef.current || isEnding || isSpeaking || processingRef.current) {
      console.log('🚫 Cannot start listening - already recording or system busy');
      return;
    }

    try {
      console.log('🎤 Starting FAST WebRTC recording...');
      processingRef.current = true;
      
      // Get microphone access with ULTRA-FAST settings
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 16000,     // Optimal for speech
          channelCount: 1,       // Mono for speed
          latency: 0.01          // ULTRA LOW LATENCY
        }
      });

      streamRef.current = stream;

      // Minimal audio context setup for SPEED
      audioContextRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }
      
      const source = audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 128;        // REDUCED for speed
      analyserRef.current.smoothingTimeConstant = 0.3; // FASTER response
      source.connect(analyserRef.current);
      
      // Use FASTEST compression format
      const fastMimeType = 'audio/webm;codecs=opus'; // Best compression/speed ratio
      
      if (!MediaRecorder.isTypeSupported(fastMimeType)) {
        throw new Error('Optimal audio format not supported');
      }
      
      console.log('🎤 Using FAST format:', fastMimeType);

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: fastMimeType,
        audioBitsPerSecond: 12000 // REDUCED for faster processing
      });

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        console.log('🎤 Recording stopped, INSTANT processing...');
        if (audioChunksRef.current.length > 0) {
          const audioBlob = new Blob(audioChunksRef.current, { type: fastMimeType });
          await processAudioBlob(audioBlob);
        }
        audioChunksRef.current = [];
      };

      mediaRecorder.onerror = (event) => {
        console.error('❌ MediaRecorder error:', event);
        onError('Recording failed. Please try again.');
        stopListening();
      };

      // Start recording IMMEDIATELY
      mediaRecorder.start();
      isRecordingRef.current = true;
      setIsListening(true);
      onListeningStart();
      processingRef.current = false;
      
      // Start lightweight visualization
      startAudioVisualization();

      // MUCH SHORTER timeout for speed
      silenceTimeoutRef.current = setTimeout(() => {
        console.log('⏰ FAST timeout - stopping recording');
        stopListening();
      }, 3000); // REDUCED from 8 to 3 seconds

      console.log('✅ LIGHTNING FAST WebRTC started');

    } catch (error) {
      console.error('❌ Failed to start recording:', error);
      processingRef.current = false;
      
      if (error instanceof Error) {
        switch (error.name) {
          case 'NotAllowedError':
            onError('🎤 Please allow microphone access');
            break;
          case 'NotFoundError':
            onError('🎤 No microphone found');
            break;
          default:
            onError('🎤 Recording failed');
        }
      } else {
        onError('🎤 Recording failed');
      }
      cleanup();
    }
  }, [isEnding, isSpeaking, onListeningStart, onError, startAudioVisualization]);

  const stopListening = useCallback(() => {
    console.log('🛑 Stopping WebRTC recording...');
    
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
      silenceTimeoutRef.current = null;
    }

    if (mediaRecorderRef.current && isRecordingRef.current) {
      try {
        mediaRecorderRef.current.stop();
      } catch (error) {
        console.log('Error stopping media recorder:', error);
      }
    }

    isRecordingRef.current = false;
    setIsListening(false);
    onListeningEnd();
    
    // Cancel audio visualization
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = 0;
    }

    // Reset audio level
    onAudioLevel(0);
  }, [onListeningEnd, onAudioLevel]);

  const processAudioBlob = useCallback(async (audioBlob: Blob) => {
    if (processingRef.current) {
      console.log('🚫 Already processing, skip');
      return;
    }

    try {
      processingRef.current = true;
      onAudioProcessing?.(true); // Notify audio processing started
      console.log('🚀 FAST processing:', audioBlob.size, 'bytes');
      
      // Skip tiny files IMMEDIATELY
      if (audioBlob.size < 800) { // Increased threshold slightly
        console.log('🔇 Too small, restarting...');
        processingRef.current = false;
        onAudioProcessing?.(false); // Notify audio processing ended
        
        if (conversationActive && !isEnding && !isSpeaking) {
          setTimeout(restartListening, 500); // FASTER restart
        }
        return;
      }
      
      const formData = new FormData();
      formData.append('audio', audioBlob, `speech_${Date.now()}.webm`);
      formData.append('language', locale);

      console.log('📤 INSTANT API call...');

      // FAST API call with shorter timeout
      const response = await fetch('/api/speech-to-text', {
        method: 'POST',
        body: formData,
        signal: AbortSignal.timeout(10000) // 10 second timeout
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'API error' }));
        throw new Error(`${response.status}: ${errorData.error || 'Recognition failed'}`);
      }

      const result = await response.json();
      
      if (result.transcript && result.transcript.trim()) {
        console.log('✅ FAST transcription:', result.transcript);
        onTranscript(result.transcript.trim());
      } else {
        console.log('🔇 No speech, restarting...');
        if (conversationActive && !isEnding && !isSpeaking) {
          setTimeout(restartListening, 500);
        }
      }

    } catch (error) {
      console.error('❌ Processing failed:', error);
      onError('Processing failed. Try again.');
    } finally {
      processingRef.current = false;
      onAudioProcessing?.(false); // Notify audio processing ended
      
      // FAST cleanup
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }

      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    }
  }, [locale, onTranscript, onError, conversationActive, isEnding, isSpeaking, onAudioProcessing]);

  const restartListening = useCallback(() => {
    if (!isEnding && conversationActive && !isSpeaking && !processingRef.current) {
      console.log('🔄 INSTANT restart...');
      setTimeout(startListening, 300); // MUCH FASTER restart
    }
  }, [isEnding, conversationActive, isSpeaking, startListening]);

  const cleanup = useCallback(() => {
    console.log('🧹 Cleaning up WebRTC voice manager...');
    
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
      silenceTimeoutRef.current = null;
    }

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = 0;
    }

    if (mediaRecorderRef.current && isRecordingRef.current) {
      try {
        mediaRecorderRef.current.stop();
      } catch (error) {
        console.log('Error stopping recorder during cleanup:', error);
      }
    }

    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    isRecordingRef.current = false;
    processingRef.current = false;
    setIsListening(false);
    onListeningEnd();
    onAudioLevel(0);
  }, [onListeningEnd, onAudioLevel]);

  // Auto-restart listening when AI finishes speaking - COMMENTED OUT FOR MANUAL CONTROL
  // useEffect(() => {
  //   if (!isSpeaking && conversationActive && !isEnding && !isRecordingRef.current && !processingRef.current) {
  //     console.log('🔄 AI finished - INSTANT restart...');
  //     setTimeout(() => {
  //       startListening();
  //     }, 500); // REDUCED from 1000ms to 500ms for instant feel
  //   }
  // }, [isSpeaking, conversationActive, isEnding, startListening]);

  return {
    startListening,
    stopListening,
    restartListening,
    cleanup,
    isListening
  };
}