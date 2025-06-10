"use client";

import { useCallback, useRef } from "react";

// TypeScript declarations for Web Speech API
interface SpeechRecognitionInterface extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  grammars: unknown;
  serviceURI: string | null;
  start(): void;
  stop(): void;
  abort(): void;
  onstart: ((this: SpeechRecognitionInterface, ev: Event) => void) | null;
  onend: ((this: SpeechRecognitionInterface, ev: Event) => void) | null;
  onresult: ((this: SpeechRecognitionInterface, ev: SpeechRecognitionEvent) => void) | null;
  onerror: ((this: SpeechRecognitionInterface, ev: SpeechRecognitionErrorEvent) => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition: {
      new (): SpeechRecognitionInterface;
    };
    webkitSpeechRecognition: {
      new (): SpeechRecognitionInterface;
    };
    webkitAudioContext: typeof AudioContext;
  }
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface VoiceRecognitionManagerProps {
  locale: string;
  isEnding: boolean;
  isSpeaking: boolean;
  conversationActive: boolean;
  autoListenMode: boolean;
  onListeningStart: () => void;
  onListeningEnd: () => void;
  onTranscript: (transcript: string) => void;
  onError: (error: string) => void;
  onAudioLevel: (level: number) => void;
}

export default function useVoiceRecognitionManager({
  locale,
  isEnding,
  isSpeaking,
  conversationActive,
  autoListenMode,
  onListeningStart,
  onListeningEnd,
  onTranscript,
  onError,
  onAudioLevel
}: VoiceRecognitionManagerProps) {
  
  const recognitionRef = useRef<SpeechRecognitionInterface | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const animationFrameRef = useRef<number>(0);
  const streamRef = useRef<MediaStream | null>(null);
  const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isRecognitionActiveRef = useRef(false);
  const lastSpeechTimeRef = useRef<number>(0);

  // Audio visualization - FIXED to work like the old component
  const startAudioVisualization = useCallback(() => {
    if (!analyserRef.current) return;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const updateAudioLevel = () => {
      if (!analyserRef.current) return;
      
      analyserRef.current.getByteFrequencyData(dataArray);
      
      // Calculate average volume level
      let sum = 0;
      for (let i = 0; i < bufferLength; i++) {
        sum += dataArray[i];
      }
      const average = sum / bufferLength;
      const normalizedLevel = Math.min(average / 128, 1); // Normalize to 0-1
      
      onAudioLevel(normalizedLevel);
      
      // Continue animation if still listening
      if (isRecognitionActiveRef.current) {
        animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
      }
    };

    updateAudioLevel();
  }, [onAudioLevel]);

  // FIXED start listening function based on working old component
  const startListening = useCallback(async () => {
    // CRITICAL: Check if already active
    if (isRecognitionActiveRef.current) {
      console.log('🚫 Recognition already active, skipping start');
      return;
    }

    if (isEnding || isSpeaking) {
      console.log('🚫 Not starting listening - ending or speaking');
      return;
    }

    console.log('🎤 Starting to listen...');
    onError('');
    
    // Stop any existing audio first
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    
    // Initialize recognition - FIXED SETTINGS
    if (!recognitionRef.current) {
      if (typeof window !== 'undefined') {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
          onError("Speech recognition not supported in this browser");
          return;
        }

        const recognition = new SpeechRecognition();
        
        // OPTIMAL SETTINGS - based on working old component
        recognition.continuous = true; // Keep listening
        recognition.interimResults = true; // Get interim results
        recognition.lang = locale === 'ar' ? 'ar-SA' : locale === 'fr' ? 'fr-FR' : 'en-US';
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
          console.log('🎤 Recognition started');
          onListeningStart();
          isRecognitionActiveRef.current = true;
          lastSpeechTimeRef.current = Date.now();
          
          // Set silence timeout
          if (silenceTimeoutRef.current) {
            clearTimeout(silenceTimeoutRef.current);
          }
          silenceTimeoutRef.current = setTimeout(() => {
            console.log('⏰ Silence timeout - stopping recognition');
            if (recognitionRef.current && isRecognitionActiveRef.current) {
              try {
                recognitionRef.current.stop();
              } catch (error) {
                console.log('Recognition already stopped:', error);
              }
            }
          }, 8000); // 8 seconds of silence
        };

        recognition.onresult = (event: SpeechRecognitionEvent) => {
          console.log('🎤 Recognition result event:', event);
          lastSpeechTimeRef.current = Date.now();
          
          // Reset silence timeout
          if (silenceTimeoutRef.current) {
            clearTimeout(silenceTimeoutRef.current);
            silenceTimeoutRef.current = setTimeout(() => {
              console.log('⏰ Silence timeout after speech');
              if (recognitionRef.current && isRecognitionActiveRef.current) {
                try {
                  recognitionRef.current.stop();
                } catch (error) {
                  console.log('Recognition already stopped:', error);
                }
              }
            }, 3000); // 3 seconds after last speech
          }
          
          let finalTranscript = '';
          
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const result = event.results[i];
            const transcript = result[0].transcript;
            
            if (result.isFinal) {
              finalTranscript += transcript;
            } else {
              // Show interim results in console for debugging
              console.log('🎤 Interim:', transcript);
            }
          }
          
          // Process final transcript
          if (finalTranscript.trim()) {
            console.log('✅ Final transcript:', finalTranscript);
            onTranscript(finalTranscript.trim());
          }
        };

        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
          console.log('🚫 Recognition error:', event.error);
          isRecognitionActiveRef.current = false;
          
          if (silenceTimeoutRef.current) {
            clearTimeout(silenceTimeoutRef.current);
          }
          
          if (event.error === 'no-speech') {
            console.log('📱 No speech detected');
            onListeningEnd();
            return;
          } else if (event.error === 'aborted') {
            onListeningEnd();
            return;
          } else if (event.error === 'not-allowed') {
            onError("🎤 Microphone access denied. Please check browser settings.");
          } else {
            onError(`🎤 Recognition error: ${event.error}`);
          }
          onListeningEnd();
        };

        recognition.onend = () => {
          console.log('🎤 Recognition ended');
          isRecognitionActiveRef.current = false;
          if (silenceTimeoutRef.current) {
            clearTimeout(silenceTimeoutRef.current);
          }
          onListeningEnd();
        };

        recognitionRef.current = recognition;
      }
    }
    
    // Setup audio context for visualization - FIXED
    if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioContextRef.current = new AudioContext();
        
        if (audioContextRef.current.state === 'suspended') {
          await audioContextRef.current.resume();
        }
        
        // Create analyser for audio visualization
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 256; // Higher resolution
        
        // Get microphone access
        console.log('📱 Requesting microphone...');
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
            sampleRate: 44100
          }
        });
        
        streamRef.current = stream;
        microphoneRef.current = audioContextRef.current.createMediaStreamSource(stream);
        microphoneRef.current.connect(analyserRef.current);
        
        startAudioVisualization();
        console.log('🎤 Microphone access successful');
      } catch (error) {
        console.error('Microphone error:', error);
        
        if (error instanceof Error) {
          if (error.name === 'NotAllowedError') {
            onError("🎤 Please allow microphone access and try again.");
          } else if (error.name === 'NotFoundError') {
            onError("🎤 No microphone found. Please check your device.");
          } else if (error.name === 'NotSupportedError') {
            onError("🎤 Voice chat not supported. Try Chrome or Safari.");
          } else {
            onError("🎤 Microphone access required. Please allow and try again.");
          }
        } else {
          onError("🎤 Microphone access required. Please allow and try again.");
        }
        return;
      }
    }
    
    // Start recognition - CRITICAL: Double check state before starting
    if (recognitionRef.current && !isRecognitionActiveRef.current && !isEnding) {
      try {
        await new Promise(resolve => setTimeout(resolve, 100));
        console.log('🎤 Starting speech recognition...');
        recognitionRef.current.start();
      } catch (error) {
        console.error('Failed to start recognition:', error);
        // Reset the state if start failed
        isRecognitionActiveRef.current = false;
        if (error instanceof Error && error.name === 'InvalidStateError') {
          onError("🎤 Recognition is busy. Please wait and try again.");
        } else {
          onError("🎤 Could not start voice recognition. Please try again.");
        }
      }
    }
  }, [locale, isEnding, isSpeaking, startAudioVisualization, onListeningStart, onListeningEnd, onTranscript, onError]);

  const stopListening = useCallback(() => {
    console.log('🛑 Stopping listening...');
    if (recognitionRef.current && isRecognitionActiveRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        console.error('Error stopping recognition:', err);
      }
    }
    isRecognitionActiveRef.current = false;
    onListeningEnd();
  }, [onListeningEnd]);

  const restartListening = useCallback(() => {
    if (!isEnding && !isSpeaking && conversationActive && autoListenMode) {
      console.log('🎤 RESTART: Scheduling restart...');
      setTimeout(() => {
        if (!isRecognitionActiveRef.current && !isEnding && !isSpeaking) {
          console.log('🎤 RESTART: Executing now!');
          startListening();
        }
      }, 1000);
    }
  }, [isEnding, isSpeaking, conversationActive, autoListenMode, startListening]);

  const cleanup = useCallback(() => {
    console.log('🧹 Cleaning up recognition...');
    
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
      silenceTimeoutRef.current = null;
    }
    
    if (recognitionRef.current && isRecognitionActiveRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.error('Error stopping recognition:', error);
      }
      isRecognitionActiveRef.current = false;
    }
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = 0;
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch((error: Error) => {
        console.error('Error closing audio context:', error);
      });
    }
    
    onListeningEnd();
    onAudioLevel(0);
  }, [onListeningEnd, onAudioLevel]);

  return {
    startListening,
    stopListening,
    restartListening,
    cleanup
  };
}