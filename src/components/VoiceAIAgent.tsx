/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Mic, MicOff, Volume2, VolumeX, X, Minimize2, Maximize2, Phone, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "@/hooks/useTranslations";

// TypeScript declarations for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
    webkitAudioContext: any;
  }
}

type VoiceMessage = { 
  role: 'user' | 'assistant'; 
  content: string; 
  timestamp: number;
  id?: string;
  type?: 'text' | 'project' | 'system';
};

interface VoiceAIAgentProps {
  isOpen: boolean;
  onClose: () => void;
  context?: string;
  persistentChatId?: string;
}

export default function VoiceAIAgent({ isOpen, onClose, context = 'general', persistentChatId = 'default' }: VoiceAIAgentProps) {
  const { locale } = useTranslations();
  const isRTL = locale === "ar";

  // Voice states - AUTO LISTEN MODE ALWAYS ON
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [error, setError] = useState<string>('');
  const [autoListenMode, setAutoListenMode] = useState(true); // ALWAYS TRUE
  const [conversationActive, setConversationActive] = useState(false);
  const [hasStartedConversation, setHasStartedConversation] = useState(false);
  const [isEnding, setIsEnding] = useState(false); // NEW: Track if conversation is ending
  
  // Load persistent messages from localStorage
  const [messages, setMessages] = useState<VoiceMessage[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(`navi-chat-${persistentChatId}`);
        if (saved) {
          const parsedMessages = JSON.parse(saved);
          if (parsedMessages.length > 0 && 
              Date.now() - parsedMessages[parsedMessages.length - 1].timestamp < 24 * 60 * 60 * 1000) {
            return parsedMessages;
          }
        }
      } catch (error) {
        console.error('Error loading chat history:', error);
      }
    }
    
    return [{
      role: 'assistant',
      content: "Hi! I'm Navi, your AI assistant. I'm ready to listen - just start talking!",
      timestamp: Date.now(),
      id: 'welcome-' + Date.now(),
      type: 'text'
    }];
  });

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined' && messages.length > 0) {
      try {
        localStorage.setItem(`navi-chat-${persistentChatId}`, JSON.stringify(messages));
      } catch (error) {
        console.error('Error saving chat history:', error);
      }
    }
  }, [messages, persistentChatId]);

  // Refs - All properly initialized
  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<any>(null);
  const analyserRef = useRef<any>(null);
  const microphoneRef = useRef<any>(null);
  const animationFrameRef = useRef<number>(0);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSpeechTimeRef = useRef<number>(0);
  const isRecognitionActiveRef = useRef(false);
  const restartTimeoutRef = useRef<NodeJS.Timeout | null>(null); // NEW: For restart delays
  const isInitializedRef = useRef(false); // NEW: Track initialization

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // SMOOTH Audio visualization
  const startAudioVisualization = useCallback(() => {
    if (!analyserRef.current) return;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const updateAudioLevel = () => {
      if (!analyserRef.current || !isListening) return;
      
      analyserRef.current.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((sum, value) => sum + value, 0) / bufferLength;
      setAudioLevel(average / 255);
      
      // Smooth animation updates
      animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
    };

    updateAudioLevel();
  }, [isListening]);

  // COMPREHENSIVE cleanup function
  const cleanup = useCallback(() => {
    console.log('🧹 Cleaning up voice agent...');
    
    // Clear all timeouts
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
      silenceTimeoutRef.current = null;
    }
    if (restartTimeoutRef.current) {
      clearTimeout(restartTimeoutRef.current);
      restartTimeoutRef.current = null;
    }

    // Stop recognition
    if (recognitionRef.current && isRecognitionActiveRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.error('Error stopping recognition:', error);
      }
      isRecognitionActiveRef.current = false;
    }

    // Stop animations
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = 0;
    }

    // Stop media streams
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    // Close audio context
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch((error: any) => {
        console.error('Error closing audio context:', error);
      });
    }

    // Stop audio playback
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.currentTime = 0;
      currentAudioRef.current = null;
    }
    
    // Stop browser TTS
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    
    setIsSpeaking(false);
    setIsListening(false);
    setAudioLevel(0);
  }, []);

  // Check for goodbye phrases
  const checkForGoodbye = useCallback((transcript: string) => {
    const goodbyePhrases = [
      'bye', 'goodbye', 'good bye', 'see you', 'talk to you later', 
      'thanks bye', 'that\'s all', 'end conversation', 'stop', 'exit',
      'au revoir', 'à bientôt', 'salut', 'merci au revoir',
      'مع السلامة', 'وداعا', 'إلى اللقاء', 'شكرا مع السلامة'
    ];
    
    const lowerTranscript = transcript.toLowerCase();
    return goodbyePhrases.some(phrase => lowerTranscript.includes(phrase));
  }, []);

  // FIXED: Auto-restart listening function - removed startListening dependency
  const restartListeningAfterSpeech = useCallback(() => {
    if (!isEnding && autoListenMode && conversationActive) {
      console.log('🎤 Scheduling auto-restart of listening...');
      restartTimeoutRef.current = setTimeout(() => {
        if (!isListening && !isSpeaking && !isEnding && conversationActive) {
          console.log('🎤 Auto-restarting listening after speech!');
          // Call startListening directly without dependency
          if (recognitionRef.current && !isRecognitionActiveRef.current) {
            try {
              recognitionRef.current.start();
            } catch (error) {
              console.error('Failed to restart recognition:', error);
            }
          }
        }
      }, 800);
    }
  }, [isEnding, autoListenMode, conversationActive, isListening, isSpeaking]);

  // FIXED: Browser TTS with proper auto-restart
  const speakWithBrowserTTS = useCallback((text: string, isGoodbye: boolean = false) => {
    return new Promise<void>((resolve) => {
      if (!window.speechSynthesis) {
        resolve();
        return;
      }

      setIsSpeaking(true);
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Consistent voice settings
      utterance.lang = locale === 'ar' ? 'ar-SA' : locale === 'fr' ? 'fr-FR' : 'en-US';
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      
      // Select consistent voice
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        const preferredVoice = voices.find(voice => 
          voice.lang.startsWith(locale === 'ar' ? 'ar' : locale === 'fr' ? 'fr' : 'en')
        );
        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }
      }
      
      utterance.onend = () => {
        console.log('🔊 Browser TTS speech ended, isGoodbye:', isGoodbye);
        setIsSpeaking(false);
        resolve();
        
        // FIXED: Only restart listening if NOT goodbye
        if (!isGoodbye) {
          restartListeningAfterSpeech();
        }
      };
      
      utterance.onerror = () => {
        setIsSpeaking(false);
        resolve();
      };
      
      window.speechSynthesis.speak(utterance);
    });
  }, [locale, restartListeningAfterSpeech]);

  // FIXED: ElevenLabs TTS - always use Navi voice unless mobile
  const speakWithElevenLabs = useCallback(async (text: string, isGoodbye: boolean = false) => {
    // FIXED: Only use browser TTS for mobile, NOT for goodbye messages
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    if (isMobile) {
      return speakWithBrowserTTS(text, isGoodbye);
    }

    // Use ElevenLabs (Navi voice) for ALL messages including goodbye
    try {
      setIsSpeaking(true);
      
      const baseUrl = window.location.origin;
      const ttsApiUrl = `${baseUrl}/api/text-to-speech`;
      
      const response = await fetch(ttsApiUrl, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        },
        body: JSON.stringify({
          text: text,
          locale: locale
        })
      });

      if (!response.ok) {
        throw new Error(`TTS API error: ${response.status}`);
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      currentAudioRef.current = new Audio(audioUrl);
      
      return new Promise<void>((resolve) => {
        if (!currentAudioRef.current) {
          resolve();
          return;
        }

        currentAudioRef.current.onended = () => {
          console.log('🔊 ElevenLabs (Navi) speech ended, isGoodbye:', isGoodbye);
          setIsSpeaking(false);
          URL.revokeObjectURL(audioUrl);
          resolve();
          
          // FIXED: Only restart listening if NOT goodbye
          if (!isGoodbye) {
            restartListeningAfterSpeech();
          }
        };
        
        currentAudioRef.current.onerror = () => {
          setIsSpeaking(false);
          URL.revokeObjectURL(audioUrl);
          console.error('ElevenLabs playback error, falling back to browser TTS');
          speakWithBrowserTTS(text, isGoodbye).then(resolve);
        };
        
        currentAudioRef.current.play().catch(() => {
          speakWithBrowserTTS(text, isGoodbye).then(resolve);
        });
      });
      
    } catch (error) {
      console.error('ElevenLabs TTS API error:', error);
      setIsSpeaking(false);
      return speakWithBrowserTTS(text, isGoodbye);
    }
  }, [locale, speakWithBrowserTTS, restartListeningAfterSpeech]);

  // SMOOTH conversation ending
  const endConversation = useCallback(async () => {
    console.log('👋 Starting conversation end sequence...');
    setIsEnding(true); // Prevent any auto-restart
    
    const farewellMessage = locale === 'fr' 
      ? "Au revoir ! N'hésitez pas à me contacter si vous avez besoin d'aide."
      : locale === 'ar'
      ? "مع السلامة! لا تترددوا في التواصل معي إذا كنتم بحاجة للمساعدة."
      : "Goodbye! Feel free to reach out if you need any help.";
    
    const aiMessage: VoiceMessage = {
      role: 'assistant',
      content: farewellMessage,
      timestamp: Date.now(),
      id: 'farewell-' + Date.now(),
      type: 'text'
    };
    
    setMessages(prev => [...prev, aiMessage]);
    
    // FIXED: Use Navi voice for goodbye (ElevenLabs), not browser TTS
    console.log('👋 Playing goodbye message with Navi voice...');
    await speakWithElevenLabs(farewellMessage, true);
    
    // Give extra time for the goodbye to fully complete
    setTimeout(() => {
      console.log('👋 Conversation ended, closing...');
      setConversationActive(false);
      setHasStartedConversation(false);
      setIsEnding(false);
      cleanup();
      onClose();
    }, 2000); // Increased from 1500 to 2000
  }, [locale, speakWithElevenLabs, cleanup, onClose]);

  // SMOOTH voice input handling
  const handleVoiceInput = useCallback(async (transcript: string) => {
    console.log('🎤 Processing voice input:', transcript);
    setIsListening(false);
    setIsProcessing(true);
    
    const userMessage: VoiceMessage = {
      role: 'user',
      content: transcript,
      timestamp: Date.now(),
      id: 'user-' + Date.now(),
      type: 'text'
    };
    
    setMessages(prev => [...prev, userMessage]);

    // Check for goodbye BEFORE making API call
    if (checkForGoodbye(transcript)) {
      console.log('👋 Goodbye detected, ending conversation...');
      setIsProcessing(false);
      await endConversation();
      return;
    }

    try {
      const baseUrl = window.location.origin;
      const apiUrl = `${baseUrl}/api/chat`; // Use regular chat endpoint
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        },
        body: JSON.stringify({
          message: transcript,
          context: context,
          history: messages.slice(-8),
          locale: locale,
          isVoiceChat: true
        })
      });

      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      
      const aiMessage: VoiceMessage = {
        role: 'assistant',
        content: data.content || "I'm sorry, I didn't understand that. Could you try again?",
        timestamp: Date.now(),
        id: 'assistant-' + Date.now(),
        type: 'text'
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsProcessing(false);
      
      // Check if AI response contains goodbye
      if (checkForGoodbye(data.content || '')) {
        console.log('👋 AI goodbye detected, ending conversation...');
        await endConversation();
      } else {
        // Speak the response (will auto-restart listening when done)
        await speakWithElevenLabs(data.content || aiMessage.content, false);
      }
      
    } catch (error) {
      console.error('Voice processing error:', error);
      const errorMessage = "Sorry, I'm having trouble processing that right now. Please try again.";
      setError(errorMessage);
      
      const errorVoiceMessage: VoiceMessage = {
        role: 'assistant',
        content: errorMessage,
        timestamp: Date.now(),
        id: 'error-' + Date.now(),
        type: 'text'
      };
      setMessages(prev => [...prev, errorVoiceMessage]);
      setIsProcessing(false);
      
      await speakWithBrowserTTS(errorMessage, false);
    }
  }, [context, locale, messages, checkForGoodbye, endConversation, speakWithElevenLabs, speakWithBrowserTTS]);

  // ROBUST start listening function
  const startListening = useCallback(async () => {
    if (isEnding) {
      console.log('🚫 Not starting listening - conversation is ending');
      return;
    }

    if (isSpeaking) {
      console.log('🚫 Not starting listening - currently speaking');
      return;
    }

    console.log('🎤 Starting to listen...');
    setError('');
    
    // Initialize recognition if needed
    if (!recognitionRef.current) {
      if (typeof window !== 'undefined') {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
          setError("Speech recognition not supported in this browser");
          return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = locale === 'ar' ? 'ar-SA' : locale === 'fr' ? 'fr-FR' : 'en-US';
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
          console.log('🎤 Recognition started');
          setIsListening(true);
          setError('');
          isRecognitionActiveRef.current = true;
          
          // Set silence timeout
          if (silenceTimeoutRef.current) {
            clearTimeout(silenceTimeoutRef.current);
          }
          silenceTimeoutRef.current = setTimeout(() => {
            console.log('⏰ Silence timeout reached');
            if (recognitionRef.current && isRecognitionActiveRef.current) {
              try {
                recognitionRef.current.stop();
              } catch (error) {
                console.log('Recognition already stopped');
              }
            }
          }, 8000);
        };

        recognition.onresult = (event: any) => {
          if (silenceTimeoutRef.current) {
            clearTimeout(silenceTimeoutRef.current);
          }
          
          const transcript = event.results[0][0].transcript.trim();
          console.log('🎤 Recognition result:', transcript);
          
          if (transcript && transcript.length > 2) {
            setConversationActive(true);
            setHasStartedConversation(true);
            handleVoiceInput(transcript);
          }
        };

        recognition.onerror = (event: any) => {
          console.log('🚫 Recognition error:', event.error);
          isRecognitionActiveRef.current = false;
          
          if (silenceTimeoutRef.current) {
            clearTimeout(silenceTimeoutRef.current);
          }
          
          if (event.error === 'no-speech') {
            setIsListening(false);
            // Auto-restart after no-speech
            if (!isEnding && autoListenMode && conversationActive) {
              restartTimeoutRef.current = setTimeout(() => {
                if (!isListening && !isSpeaking && !isEnding) {
                  startListening();
                }
              }, 2000);
            }
            return;
          } else if (event.error === 'aborted') {
            setIsListening(false);
            return;
          } else if (event.error === 'not-allowed') {
            setError("Microphone access denied. Please allow microphone access.");
            setAutoListenMode(false);
          } else {
            setError("Speech recognition error. Please try again.");
          }
          setIsListening(false);
        };

        recognition.onend = () => {
          console.log('🎤 Recognition ended');
          isRecognitionActiveRef.current = false;
          if (silenceTimeoutRef.current) {
            clearTimeout(silenceTimeoutRef.current);
          }
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
    
    // Setup audio context if needed - IMPROVED mobile handling
    if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioContextRef.current = new AudioContext();
        analyserRef.current = audioContextRef.current.createAnalyser();
        
        // IMPROVED: Better mobile microphone request
        const stream = await navigator.mediaDevices.getUserMedia({ 
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
            // Mobile-specific optimizations
            sampleRate: 16000,
            channelCount: 1
          }
        });
        
        streamRef.current = stream;
        microphoneRef.current = audioContextRef.current.createMediaStreamSource(stream);
        microphoneRef.current.connect(analyserRef.current);
        analyserRef.current.fftSize = 256;
        
        startAudioVisualization();
        console.log('🎤 Microphone access granted successfully');
      } catch (error) {
        console.error('Microphone access error:', error);
        
        // IMPROVED: Better error messages for mobile
        if (error.name === 'NotAllowedError') {
          setError("🎤 Please allow microphone access in your browser settings and refresh the page.");
        } else if (error.name === 'NotFoundError') {
          setError("🎤 No microphone found. Please check your device settings.");
        } else if (error.name === 'NotSupportedError') {
          setError("🎤 Voice chat not supported in this browser. Try Chrome or Safari.");
        } else {
          setError("🎤 Microphone access required. Please allow and try again.");
        }
        return;
      }
    }
    
    // Start recognition
    if (recognitionRef.current && !isRecognitionActiveRef.current && !isEnding) {
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error('Failed to start recognition:', error);
        setError("Could not start voice recognition. Please try again.");
      }
    }
  }, [locale, isEnding, isSpeaking, autoListenMode, conversationActive, startAudioVisualization, handleVoiceInput]);

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
    setIsListening(false);
  }, []);

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
    setIsSpeaking(false);
  }, []);

  const handleMicButtonClick = useCallback(() => {
    console.log('🎤 Mic button clicked, isListening:', isListening);
    if (isListening) {
      stopListening();
    } else {
      setConversationActive(true);
      setHasStartedConversation(true);
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  const clearChat = useCallback(() => {
    console.log('🧹 Clearing chat...');
    const welcomeMessage: VoiceMessage = {
      role: 'assistant',
      content: "Chat cleared! I'm ready to listen - just start talking!",
      timestamp: Date.now(),
      id: 'welcome-' + Date.now(),
      type: 'text'
    };
    setMessages([welcomeMessage]);
    setConversationActive(false);
    setHasStartedConversation(false);
    setIsEnding(false);
    cleanup();
    
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(`navi-chat-${persistentChatId}`);
      } catch (err) {
        console.error('Error clearing chat history:', err);
      }
    }
  }, [persistentChatId, cleanup]);

  const handleGoodbyeClick = useCallback(async () => {
    console.log('👋 Manual goodbye clicked');
    await endConversation();
  }, [endConversation]);

  // AUTO-START listening when component opens
  useEffect(() => {
    if (isOpen && !isInitializedRef.current) {
      console.log('🚀 Voice agent opened, auto-starting...');
      isInitializedRef.current = true;
      
      // Auto-start after a brief delay
      const initTimeout = setTimeout(() => {
        if (!isListening && !isSpeaking && !isEnding) {
          setConversationActive(true);
          setHasStartedConversation(true);
          startListening();
        }
      }, 1500);

      return () => clearTimeout(initTimeout);
    }
    
    if (!isOpen) {
      isInitializedRef.current = false;
      setIsEnding(false);
    }
  }, [isOpen, startListening, isListening, isSpeaking, isEnding]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  // Stop audio visualization when not listening
  useEffect(() => {
    if (!isListening && animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      setAudioLevel(0);
    }
  }, [isListening]);

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-50 ${isRTL ? 'font-arabic' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
      
      {/* SMOOTH Voice Agent Interface */}
      <AnimatePresence>
        {!isMinimized && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 100 }}
            className="fixed bottom-4 left-4 right-4 md:right-4 md:left-auto md:w-96 bg-white rounded-2xl shadow-2xl border overflow-hidden max-h-[85vh]"
          >
            {/* Header */}
            <div className="relative bg-gradient-to-r from-[#4083b7] to-[#3474ac] text-white">
              <div className="flex items-center justify-between p-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <Phone className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">NAvi Assistant</h3>
                    <p className="text-xs text-white/90">
                      {isEnding ? "Ending conversation..." : "Auto-listen active"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setIsMinimized(true)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                    title="Minimize"
                  >
                    <Minimize2 className="w-3 h-3" />
                  </button>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                    title="Close"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="h-64 md:h-80 overflow-y-auto p-3 space-y-3 bg-gray-50">
              <AnimatePresence>
                {messages.map((message, index) => (
                  <motion.div
                    key={message.id || index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] p-3 rounded-xl text-sm ${
                        message.role === 'user'
                          ? 'bg-[#4083b7] text-white rounded-br-md'
                          : 'bg-white text-gray-800 border rounded-bl-md'
                      }`}
                    >
                      {message.role === 'assistant' && (
                        <div className="flex items-center gap-1 mb-1">
                          <span className="text-xs font-medium text-[#4083b7]">NAvi</span>
                          <div className="w-1 h-1 bg-green-400 rounded-full"></div>
                        </div>
                      )}
                      <p className="leading-relaxed break-words">{message.content}</p>
                      <p className={`text-xs mt-1 ${message.role === 'user' ? 'text-white/70' : 'text-gray-500'}`}>
                        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>

            {/* Controls */}
            <div className="p-3 bg-white border-t">
              {/* Status Display */}
              <div className="mb-3">
                {error ? (
                  <div className="flex items-center gap-2 p-2 bg-red-50 border border-red-200 rounded-lg">
                    <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0" />
                    <p className="text-red-700 text-xs">{error}</p>
                  </div>
                ) : isProcessing ? (
                  <div className="flex items-center gap-2 p-2 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin flex-shrink-0" />
                    <p className="text-blue-700 text-xs">Processing...</p>
                  </div>
                ) : isListening ? (
                  <div className="p-2 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse flex-shrink-0" />
                      <p className="text-red-700 text-xs font-medium">Listening...</p>
                    </div>
                    <div className="w-full bg-red-100 rounded-full h-1">
                      <div
                        className="bg-red-500 h-1 rounded-full transition-all duration-150"
                        style={{ width: `${Math.max(audioLevel * 100, 10)}%` }}
                      />
                    </div>
                  </div>
                ) : isSpeaking ? (
                  <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded-lg">
                    <Volume2 className="w-3 h-3 text-green-600 animate-pulse flex-shrink-0" />
                    <p className="text-green-700 text-xs font-medium">NAvi is speaking...</p>
                  </div>
                ) : isEnding ? (
                  <div className="flex items-center gap-2 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full flex-shrink-0" />
                    <p className="text-yellow-700 text-xs">Ending conversation...</p>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 p-2 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                    <p className="text-blue-700 text-xs">Ready to listen - start talking!</p>
                  </div>
                )}
              </div>

              {/* Control Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {/* Clear Chat */}
                  <button
                    onClick={clearChat}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Clear chat"
                    disabled={isEnding}
                  >
                    <Trash2 className="w-4 h-4 text-gray-500" />
                  </button>

                  {/* Goodbye Button */}
                  <button
                    onClick={handleGoodbyeClick}
                    className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                    title="End conversation"
                    disabled={isEnding}
                  >
                    <Phone className="w-4 h-4 text-red-500 transform rotate-[135deg]" />
                  </button>

                  {/* Auto-Listen Status (always on) */}
                  <div className="flex items-center gap-1">
                    <div className="w-8 h-4 bg-[#4083b7] rounded-full">
                      <div className="w-3 h-3 bg-white rounded-full translate-x-4 transition-transform" />
                    </div>
                    <span className="text-xs text-gray-600">Auto</span>
                  </div>
                </div>

                {/* Main Mic Button */}
                <motion.button
                  onClick={handleMicButtonClick}
                  disabled={isProcessing || isEnding}
                  className={`w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 disabled:opacity-50 ${
                    isListening
                      ? 'bg-red-500 shadow-red-500/30 scale-110'
                      : isSpeaking
                      ? 'bg-green-500 shadow-green-500/30'
                      : 'bg-[#4083b7] shadow-[#4083b7]/30 hover:bg-[#3474ac]'
                  }`}
                  whileTap={{ scale: 0.95 }}
                >
                  <AnimatePresence mode="wait">
                    {isListening ? (
                      <MicOff className="w-5 h-5 text-white" />
                    ) : isSpeaking ? (
                      <VolumeX className="w-5 h-5 text-white" onClick={stopSpeaking} />
                    ) : (
                      <Mic className="w-5 h-5 text-white" />
                    )}
                  </AnimatePresence>
                </motion.button>
              </div>

              {/* Helper Text */}
              <p className="text-center text-xs text-gray-500 mt-2">
                {isEnding 
                  ? "Ending conversation..." 
                  : isListening 
                    ? "Speak now..." 
                    : isSpeaking
                      ? "NAvi is speaking..."
                      : "Auto-listen active - start talking!"
                }
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Minimized Button */}
      {isMinimized && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="fixed right-4 bottom-4"
        >
          <button
            onClick={() => setIsMinimized(false)}
            className="w-12 h-12 bg-[#4083b7] hover:bg-[#3474ac] text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300"
          >
            <Maximize2 className="w-5 h-5" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border border-white">
              <div className="w-full h-full bg-green-400 rounded-full animate-ping"></div>
            </div>
          </button>
        </motion.div>
      )}
    </div>
  );
}