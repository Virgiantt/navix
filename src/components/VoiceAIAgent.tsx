/* eslint-disable @typescript-eslint/no-explicit-any */
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
  const { t, locale } = useTranslations();
  const isRTL = locale === "ar";

  // Voice states
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [error, setError] = useState<string>('');
  const [autoListenMode, setAutoListenMode] = useState(false);
  const [conversationActive, setConversationActive] = useState(false);
  const [hasStartedConversation, setHasStartedConversation] = useState(false);
  
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
      } catch (err) {
        console.error('Error loading chat history:', err);
      }
    }
    
    return [{
      role: 'assistant',
      content: "Hi! I'm Navi, your AI assistant from Navix Agency. I can help you with our services, show you projects, or answer any questions. How can I help you today?",
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
      } catch (err) {
        console.error('Error saving chat history:', err);
      }
    }
  }, [messages, persistentChatId]);

  // Refs
  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<any>(null);
  const analyserRef = useRef<any>(null);
  const microphoneRef = useRef<any>(null);
  const animationFrameRef = useRef<number | undefined>();
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSpeechTimeRef = useRef<number>(0);
  const isRecognitionActiveRef = useRef(false);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Audio visualization function
  const startAudioVisualization = useCallback(() => {
    if (!analyserRef.current) return;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const updateAudioLevel = () => {
      if (!analyserRef.current) return;
      
      analyserRef.current.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((sum, value) => sum + value, 0) / bufferLength;
      setAudioLevel(average / 255);
      
      if (isListening) {
        animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
      }
    };

    updateAudioLevel();
  }, [isListening]);

  // Browser TTS fallback
  const speakWithBrowserTTS = useCallback((text: string) => {
    if (window.speechSynthesis) {
      setIsSpeaking(true);
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = locale === 'ar' ? 'ar-SA' : locale === 'fr' ? 'fr-FR' : 'en-US';
      utterance.rate = 0.9;
      utterance.pitch = 1;
      
      utterance.onend = () => {
        setIsSpeaking(false);
        if (autoListenMode && conversationActive && !isProcessing) {
          setTimeout(() => {
            if (!isListening && !isSpeaking) {
              startListening();
            }
          }, 1500);
        }
      };
      
      utterance.onerror = () => {
        setIsSpeaking(false);
      };
      
      window.speechSynthesis.speak(utterance);
    }
  }, [locale, autoListenMode, conversationActive, isProcessing, isListening, isSpeaking]);

  // Enhanced cleanup function
  const cleanup = useCallback(() => {
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
      silenceTimeoutRef.current = null;
    }

    if (recognitionRef.current && isRecognitionActiveRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        console.error('Error stopping recognition during cleanup:', err);
      }
      isRecognitionActiveRef.current = false;
    }

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch((err: any) => {
        console.error('Error closing audio context:', err);
      });
    }

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

  // Enhanced TTS with ElevenLabs
  const speakWithElevenLabs = useCallback(async (text: string) => {
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
      
      currentAudioRef.current.onended = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
        
        if (autoListenMode && conversationActive && !isProcessing) {
          setTimeout(() => {
            if (!isListening && !isSpeaking) {
              startListening();
            }
          }, 1500);
        }
      };
      
      currentAudioRef.current.onerror = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
        console.error('Audio playback error, falling back to browser TTS');
        speakWithBrowserTTS(text);
      };
      
      await currentAudioRef.current.play();
      
    } catch (err) {
      console.error('TTS API error:', err);
      setIsSpeaking(false);
      speakWithBrowserTTS(text);
    }
  }, [locale, speakWithBrowserTTS, autoListenMode, conversationActive, isProcessing, isListening, isSpeaking]);

  // Control functions
  const startListening = useCallback(async () => {
    if (isSpeaking) {
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current.currentTime = 0;
        currentAudioRef.current = null;
      }
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      setIsSpeaking(false);
    }
    
    setError('');
    
    if (!recognitionRef.current) {
      if (typeof window !== 'undefined') {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
          const recognition = new SpeechRecognition();
          recognition.continuous = false;
          recognition.interimResults = false;
          recognition.lang = locale === 'ar' ? 'ar-SA' : locale === 'fr' ? 'fr-FR' : 'en-US';

          recognition.onstart = () => {
            setIsListening(true);
            setError('');
            isRecognitionActiveRef.current = true;
            lastSpeechTimeRef.current = Date.now();
            
            if (silenceTimeoutRef.current) {
              clearTimeout(silenceTimeoutRef.current);
            }
            silenceTimeoutRef.current = setTimeout(() => {
              if (recognitionRef.current && isRecognitionActiveRef.current) {
                try {
                  recognitionRef.current.stop();
                } catch (err) {
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
            if (transcript && transcript.length > 2) {
              setConversationActive(true);
              setHasStartedConversation(true);
              handleVoiceInput(transcript);
            } else {
              if (autoListenMode && conversationActive && hasStartedConversation) {
                setTimeout(() => {
                  if (!isListening && !isSpeaking && !isProcessing) {
                    startListening();
                  }
                }, 1500);
              }
            }
          };

          recognition.onerror = (event: any) => {
            isRecognitionActiveRef.current = false;
            if (silenceTimeoutRef.current) {
              clearTimeout(silenceTimeoutRef.current);
            }
            
            console.log('Speech recognition event:', event.error);
            
            if (event.error === 'no-speech') {
              setIsListening(false);
              // Only restart if conversation has actually started and auto-listen is on
              if (autoListenMode && conversationActive && hasStartedConversation && !isProcessing) {
                setTimeout(() => {
                  if (!isListening && !isSpeaking) {
                    startListening();
                  }
                }, 2000);
              }
              return;
            } else if (event.error === 'aborted') {
              setIsListening(false);
              return;
            } else if (event.error === 'not-allowed') {
              setError("Microphone access denied. Please allow microphone access and try again.");
              setAutoListenMode(false);
            } else if (event.error === 'network') {
              setError("Network error. Please check your connection and try again.");
            } else {
              console.error('Speech recognition error:', event.error);
            }
            setIsListening(false);
          };

          recognition.onend = () => {
            isRecognitionActiveRef.current = false;
            if (silenceTimeoutRef.current) {
              clearTimeout(silenceTimeoutRef.current);
            }
            setIsListening(false);
          };

          recognitionRef.current = recognition;
        } else {
          setError("Speech recognition not supported in this browser");
          return;
        }
      }
    }
    
    if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
      try {
        if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
          await audioContextRef.current.close();
        }

        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioContextRef.current = new AudioContext();
        analyserRef.current = audioContextRef.current.createAnalyser();
        
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;
        microphoneRef.current = audioContextRef.current.createMediaStreamSource(stream);
        microphoneRef.current.connect(analyserRef.current);
        
        analyserRef.current.fftSize = 256;
        startAudioVisualization();
      } catch (err) {
        console.error('Microphone access denied:', err);
        setError("Microphone access required for voice chat");
        setAutoListenMode(false);
        return;
      }
    }
    
    if (recognitionRef.current && !isRecognitionActiveRef.current) {
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.error('Speech recognition start error:', err);
        setError("Could not start voice recognition. Please try again.");
      }
    }
  }, [isSpeaking, locale, startAudioVisualization, autoListenMode, conversationActive, isListening, isProcessing, hasStartedConversation]);

  const stopListening = useCallback(() => {
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

  // Check if user wants to end the conversation
  const checkForGoodbye = useCallback((transcript: string) => {
    const goodbyePhrases = [
      'bye', 'goodbye', 'good bye', 'see you', 'talk to you later', 
      'thanks bye', 'that\'s all', 'end conversation', 'stop', 'exit',
      'au revoir', 'à bientôt', 'salut',
      'مع السلامة', 'وداعا', 'إلى اللقاء'
    ];
    
    const lowerTranscript = transcript.toLowerCase();
    return goodbyePhrases.some(phrase => lowerTranscript.includes(phrase));
  }, []);

  // Handle conversation ending
  const endConversation = useCallback(() => {
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
    speakWithElevenLabs(farewellMessage);
    
    setTimeout(() => {
      setConversationActive(false);
      setHasStartedConversation(false);
      setAutoListenMode(false);
      cleanup();
    }, 3000);
  }, [locale, speakWithElevenLabs, cleanup]);

  // Enhanced handleVoiceInput with project integration
  const handleVoiceInput = useCallback(async (transcript: string) => {
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

    if (checkForGoodbye(transcript)) {
      setIsProcessing(false);
      endConversation();
      return;
    }

    try {
      const baseUrl = window.location.origin;
      const apiUrl = `${baseUrl}/api/chat`;
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        },
        body: JSON.stringify({
          message: transcript,
          history: messages.slice(-10),
          context: context,
          locale: locale,
          isVoiceChat: true,
          includeProjects: true
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Details:', response.status, response.statusText, errorText);
        throw new Error(`API responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      
      const aiMessage: VoiceMessage = {
        role: 'assistant',
        content: data.content || "I'm sorry, I didn't understand that. Could you try again?",
        timestamp: Date.now(),
        id: 'assistant-' + Date.now(),
        type: data.projects && data.projects.length > 0 ? 'project' : 'text'
      };
      
      setMessages(prev => [...prev, aiMessage]);
      
      // Add project cards if provided
      if (data.projects && data.projects.length > 0) {
        const projectMessage: VoiceMessage = {
          role: 'assistant',
          content: JSON.stringify(data.projects),
          timestamp: Date.now(),
          id: 'projects-' + Date.now(),
          type: 'project'
        };
        setMessages(prev => [...prev, projectMessage]);
      }
      
      if (data.shouldEndConversation || checkForGoodbye(data.content || '')) {
        setConversationActive(false);
        setHasStartedConversation(false);
        speakWithElevenLabs(data.content || aiMessage.content);
        setTimeout(() => {
          cleanup();
          onClose();
        }, 3000);
      } else {
        speakWithElevenLabs(data.content || aiMessage.content);
      }
      
    } catch (err) {
      console.error('Voice processing error:', err);
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
      
      speakWithBrowserTTS(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  }, [context, locale, speakWithElevenLabs, speakWithBrowserTTS, messages, checkForGoodbye, endConversation, cleanup, onClose]);

  const handleMicButtonClick = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      setConversationActive(true);
      setHasStartedConversation(true);
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  // Clear chat function
  const clearChat = useCallback(() => {
    const welcomeMessage: VoiceMessage = {
      role: 'assistant',
      content: "Chat cleared! How can I help you today?",
      timestamp: Date.now(),
      id: 'welcome-' + Date.now(),
      type: 'text'
    };
    setMessages([welcomeMessage]);
    setConversationActive(false);
    setHasStartedConversation(false);
    setAutoListenMode(false);
    cleanup();
    
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(`navi-chat-${persistentChatId}`);
      } catch (err) {
        console.error('Error clearing chat history:', err);
      }
    }
  }, [persistentChatId, cleanup]);

  // Enhanced Controls with Clear Chat and Goodbye Button
  const handleGoodbyeClick = useCallback(() => {
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
    speakWithElevenLabs(farewellMessage);
    
    setTimeout(() => {
      setConversationActive(false);
      setHasStartedConversation(false);
      setAutoListenMode(false);
      cleanup();
      onClose();
    }, 3000);
  }, [locale, speakWithElevenLabs, cleanup, onClose]);

  // Cleanup on unmount or close
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
      
      {/* Main Voice Agent Interface - Moved to right side */}
      <AnimatePresence>
        {!isMinimized && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 100 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, x: 100 }}
            className="fixed right-4 bottom-4 w-96 max-w-[calc(100vw-2rem)] sm:max-w-sm md:max-w-md lg:max-w-lg bg-white rounded-2xl shadow-2xl border overflow-hidden"
          >
            {/* Creative Header with NAvi Agent indicator */}
            <div className="relative bg-gradient-to-r from-[#4083b7] to-[#3474ac] text-white overflow-hidden">
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-12 -translate-x-12"></div>
              </div>
              
              <div className="relative flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  {/* Animated NAvi indicator */}
                  <div className="relative">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    {/* Pulse animation */}
                    <div className="absolute inset-0 w-12 h-12 bg-white/20 rounded-full animate-ping"></div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-lg">NAvi</h3>
                      <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs font-medium">
                        AI Agent
                      </span>
                    </div>
                    <p className="text-xs text-white/90 font-medium">
                      🚀 Meet our smart assistant
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsMinimized(true)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                    title="Minimize"
                  >
                    <Minimize2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                    title="Close"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {/* "Meet our NAvi agent" indicator strip */}
              <div className="relative bg-white/10 backdrop-blur-sm px-4 py-2 border-t border-white/20">
                <div className="flex items-center justify-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-sm font-medium text-white/95">
                    {locale === 'fr' 
                      ? 'Rencontrez notre agent NAvi'
                      : locale === 'ar'
                      ? 'تعرف على وكيلنا نافي'
                      : 'Meet our NAvi agent'
                    }
                  </span>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Messages Area - Enhanced for mobile */}
            <div className="h-80 overflow-y-auto p-4 space-y-4 bg-gray-50 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              <AnimatePresence>
                {messages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] sm:max-w-[80%] p-3 sm:p-4 rounded-2xl shadow-sm ${
                        message.role === 'user'
                          ? 'bg-[#4083b7] text-white rounded-br-md'
                          : 'bg-white text-gray-800 border rounded-bl-md'
                      }`}
                    >
                      {message.role === 'assistant' && (
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 bg-[#4083b7]/10 rounded-full flex items-center justify-center">
                            <Phone className="w-3 h-3 text-[#4083b7]" />
                          </div>
                          <span className="text-xs font-medium text-[#4083b7]">NAvi</span>
                          <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                        </div>
                      )}
                      <p className="text-sm leading-relaxed break-words">{message.content}</p>
                      <p className={`text-xs mt-2 ${message.role === 'user' ? 'text-white/70' : 'text-gray-500'}`}>
                        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>

            {/* Status and Controls - Enhanced mobile layout */}
            <div className="p-4 bg-white border-t">
              {/* Status Display */}
              <div className="mb-4">
                {error ? (
                  <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0" />
                    <p className="text-red-700 text-sm break-words">{error}</p>
                  </div>
                ) : isProcessing ? (
                  <div className="flex items-center gap-3 p-3 bg-[#4083b7]/5 border border-[#4083b7]/20 rounded-lg">
                    <div className="w-5 h-5 border-2 border-[#4083b7] border-t-transparent rounded-full animate-spin flex-shrink-0" />
                    <p className="text-[#27547d] text-sm font-medium">Processing your message...</p>
                  </div>
                ) : isListening ? (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse flex-shrink-0" />
                      <p className="text-red-700 text-sm font-medium">Listening...</p>
                    </div>
                    <div className="w-full bg-red-100 rounded-full h-2">
                      <div
                        className="bg-red-500 h-2 rounded-full transition-all duration-150"
                        style={{ width: `${Math.max(audioLevel * 100, 10)}%` }}
                      />
                    </div>
                  </div>
                ) : isSpeaking ? (
                  <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <Volume2 className="w-5 h-5 text-green-600 animate-pulse flex-shrink-0" />
                    <p className="text-green-700 text-sm font-medium">NAvi is speaking...</p>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 p-3 bg-[#4083b7]/5 border border-[#4083b7]/20 rounded-lg">
                    <div className="w-2 h-2 bg-[#4083b7] rounded-full flex-shrink-0" />
                    <p className="text-[#27547d] text-sm">Ready to chat! Click the mic to start.</p>
                  </div>
                )}
              </div>

              {/* Enhanced Controls - Mobile optimized */}
              <div className="flex items-center justify-center gap-3 sm:gap-4">
                {/* Clear Chat Button */}
                <button
                  onClick={clearChat}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors touch-manipulation"
                  title="Clear chat history"
                >
                  <Trash2 className="w-4 h-4 text-gray-500" />
                </button>

                {/* Goodbye Button */}
                <button
                  onClick={handleGoodbyeClick}
                  className="p-2 hover:bg-red-100 rounded-lg transition-colors touch-manipulation"
                  title="End conversation"
                >
                  <Phone className="w-4 h-4 text-red-500 transform rotate-[135deg]" />
                </button>

                {/* Auto-Listen Toggle */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const newAutoMode = !autoListenMode;
                      setAutoListenMode(newAutoMode);
                      
                      // If turning on auto-listen and not currently in conversation, start
                      if (newAutoMode && !conversationActive && !isListening && !isSpeaking) {
                        setConversationActive(true);
                        setHasStartedConversation(true);
                        setTimeout(() => startListening(), 500);
                      }
                    }}
                    className={`w-8 h-4 rounded-full transition-all duration-300 touch-manipulation ${
                      autoListenMode ? 'bg-[#4083b7]' : 'bg-gray-300'
                    }`}
                    title={autoListenMode ? "Auto-listen enabled" : "Auto-listen disabled"}
                  >
                    <div
                      className={`w-3 h-3 bg-white rounded-full transition-transform duration-300 ${
                        autoListenMode ? 'translate-x-4' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                  <span className="text-xs text-gray-600 hidden sm:inline">Auto</span>
                </div>

                {/* Main Mic Button - Enhanced */}
                <motion.button
                  onClick={handleMicButtonClick}
                  disabled={isProcessing}
                  className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 disabled:opacity-50 touch-manipulation ${
                    isListening
                      ? 'bg-red-500 shadow-red-500/30 scale-110'
                      : isSpeaking
                      ? 'bg-green-500 shadow-green-500/30'
                      : 'bg-[#4083b7] shadow-[#4083b7]/30 hover:bg-[#3474ac] hover:scale-105'
                  }`}
                  whileTap={{ scale: 0.95 }}
                  title={isListening ? "Stop listening" : "Start voice chat"}
                >
                  <AnimatePresence mode="wait">
                    {isListening ? (
                      <motion.div
                        key="listening"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                      >
                        <MicOff className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                      </motion.div>
                    ) : isSpeaking ? (
                      <motion.div
                        key="speaking"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        onClick={stopSpeaking}
                      >
                        <VolumeX className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="idle"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                      >
                        <Mic className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              </div>

              {/* Updated Helper Text - Mobile responsive */}
              <p className="text-center text-xs text-gray-500 mt-3 px-2">
                {isListening 
                  ? "Speak now... (or say 'goodbye' to end)" 
                  : autoListenMode && conversationActive
                    ? "Auto-mode: Will listen after each response"
                    : isSpeaking
                    ? "Click speaker to stop • Chat persists across pages"
                    : "Click mic to start • Auto-toggle for hands-free"
                }
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced Minimized Floating Button */}
      {isMinimized && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="fixed right-4 bottom-4"
        >
          {/* Indicator when minimized */}
          <div className="absolute -top-12 right-0 bg-[#4083b7] text-white px-3 py-1 rounded-lg text-xs font-medium shadow-lg">
            {locale === 'fr' 
              ? 'NAvi Assistant'
              : locale === 'ar'
              ? 'مساعد نافي'
              : 'NAvi Assistant'
            }
            <div className="absolute bottom-[-4px] right-4 w-2 h-2 bg-[#4083b7] transform rotate-45"></div>
          </div>
          
          <button
            onClick={() => setIsMinimized(false)}
            className="relative w-16 h-16 bg-[#4083b7] hover:bg-[#3474ac] text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 touch-manipulation"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Open voice assistant"
          >
            <Maximize2 className="w-6 h-6" />
            {/* Online indicator */}
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white">
              <div className="w-full h-full bg-green-400 rounded-full animate-ping"></div>
            </div>
          </button>
        </motion.div>
      )}

      {/* Enhanced Ripple Effects - Mobile responsive */}
      {(isListening || isSpeaking) && !isMinimized && (
        <>
          <div
            className="fixed right-[116px] sm:right-[116px] bottom-[90px] sm:bottom-[100px] w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 animate-ping pointer-events-none"
            style={{ borderColor: isListening ? '#ef4444' : '#10b981' }}
          />
          <div
            className="fixed right-[108px] sm:right-[112px] bottom-[82px] sm:bottom-[96px] w-20 h-20 sm:w-24 sm:h-24 rounded-full border animate-ping pointer-events-none opacity-50"
            style={{ borderColor: isListening ? '#ef4444' : '#10b981', animationDelay: '0.5s' }}
          />
        </>
      )}
    </div>
  );
}