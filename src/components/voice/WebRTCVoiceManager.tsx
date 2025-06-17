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
  onAudioLevel
}: WebRTCVoiceManagerProps) {
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const isRecordingRef = useRef(false);
  const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number>(0);
  const processingRef = useRef(false);

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
      console.log('🎤 Starting WebRTC recording...');
      processingRef.current = true;
      
      // Get microphone access with optimized settings
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 16000, // Optimal for speech recognition
          channelCount: 1     // Mono audio
        }
      });

      streamRef.current = stream;

      // Set up audio visualization
      audioContextRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      
      // Resume audio context if suspended (mobile requirement)
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }
      
      const source = audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      analyserRef.current.smoothingTimeConstant = 0.8;
      source.connect(analyserRef.current);
      
      // Configure MediaRecorder with optimal settings
      const mimeTypes = [
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/mp4',
        'audio/wav'
      ];
      
      let selectedMimeType = '';
      for (const mimeType of mimeTypes) {
        if (MediaRecorder.isTypeSupported(mimeType)) {
          selectedMimeType = mimeType;
          break;
        }
      }
      
      if (!selectedMimeType) {
        throw new Error('No supported audio format found');
      }
      
      console.log('🎤 Using MIME type:', selectedMimeType);

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: selectedMimeType,
        audioBitsPerSecond: 16000 // Optimal for speech
      });

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
          console.log('🎤 Audio chunk received:', event.data.size, 'bytes');
        }
      };

      mediaRecorder.onstop = async () => {
        console.log('🎤 Recording stopped, processing audio...');
        if (audioChunksRef.current.length > 0) {
          const audioBlob = new Blob(audioChunksRef.current, { type: selectedMimeType });
          await processAudioBlob(audioBlob);
        }
        audioChunksRef.current = [];
      };

      mediaRecorder.onerror = (event) => {
        console.error('❌ MediaRecorder error:', event);
        onError('Recording failed. Please try again.');
        stopListening();
      };

      // Start recording
      mediaRecorder.start();
      isRecordingRef.current = true;
      setIsListening(true);
      onListeningStart();
      processingRef.current = false;
      
      // Start audio visualization
      startAudioVisualization();

      // Set up silence detection timeout
      silenceTimeoutRef.current = setTimeout(() => {
        console.log('⏰ Silence timeout - stopping recording');
        stopListening();
      }, 8000); // 8 seconds of recording time

      console.log('✅ WebRTC recording started successfully');

    } catch (error) {
      console.error('❌ Failed to start recording:', error);
      processingRef.current = false;
      
      if (error instanceof Error) {
        switch (error.name) {
          case 'NotAllowedError':
            onError('🎤 Microphone access denied. Please allow microphone access and try again.');
            break;
          case 'NotFoundError':
            onError('🎤 No microphone found. Please check your device settings.');
            break;
          case 'NotSupportedError':
            onError('🎤 Audio recording not supported on this device.');
            break;
          default:
            onError('🎤 Microphone access failed. Please check permissions and try again.');
        }
      } else {
        onError('🎤 Failed to start voice recording. Please try again.');
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
      console.log('🚫 Already processing audio, skipping...');
      return;
    }

    try {
      processingRef.current = true;
      console.log('🔄 Processing audio blob:', audioBlob.size, 'bytes');
      
      // Skip very small audio files (likely silence)
      if (audioBlob.size < 1000) { // Less than 1KB
        console.log('🔇 Audio too small, likely silence');
        processingRef.current = false;
        
        // Auto-restart listening for continuous conversation
        if (conversationActive && !isEnding && !isSpeaking) {
          setTimeout(() => {
            restartListening();
          }, 1000);
        }
        return;
      }
      
      const formData = new FormData();
      formData.append('audio', audioBlob, `speech_${Date.now()}.webm`);
      formData.append('language', locale);

      console.log('📤 Sending audio to speech-to-text API...');

      const response = await fetch('/api/speech-to-text', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(`API error ${response.status}: ${errorData.error || 'Speech recognition failed'}`);
      }

      const result = await response.json();
      
      if (result.transcript && result.transcript.trim()) {
        console.log('✅ Transcription successful:', result.transcript);
        onTranscript(result.transcript.trim());
      } else {
        console.log('🔇 No speech detected in audio');
        // Don't show error for silence - just restart listening
        if (conversationActive && !isEnding && !isSpeaking) {
          setTimeout(() => {
            restartListening();
          }, 1000);
        }
      }

    } catch (error) {
      console.error('❌ Audio processing failed:', error);
      onError('Speech processing failed. Please try again.');
    } finally {
      processingRef.current = false;
      
      // Close audio context after processing
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }

      // Stop media stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    }
  }, [locale, onTranscript, onError, conversationActive, isEnding, isSpeaking]);

  const restartListening = useCallback(() => {
    if (!isEnding && conversationActive && !isSpeaking && !processingRef.current) {
      console.log('🔄 Restarting WebRTC listening...');
      setTimeout(() => {
        startListening();
      }, 500);
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

  // Auto-restart listening when AI finishes speaking
  useEffect(() => {
    if (!isSpeaking && conversationActive && !isEnding && !isRecordingRef.current && !processingRef.current) {
      console.log('🔄 AI finished speaking - auto-restarting listening...');
      setTimeout(() => {
        startListening();
      }, 1000); // 1 second delay for smooth transition
    }
  }, [isSpeaking, conversationActive, isEnding, startListening]);

  return {
    startListening,
    stopListening,
    restartListening,
    cleanup,
    isListening
  };
}