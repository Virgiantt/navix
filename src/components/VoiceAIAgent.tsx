/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { X, Minimize2, Maximize2, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "@/hooks/useTranslations";

// Import sub-components
import VoiceMessagesList, { VoiceMessage } from "./voice/VoiceMessagesList";
import VoiceStatusIndicator from "./voice/VoiceStatusIndicator";
import VoiceControls from "./voice/VoiceControls";
import useVoiceAudioManager from "./voice/VoiceAudioManager";
import useVoiceRecognitionManager from "./voice/VoiceRecognitionManager";

interface VoiceAIAgentProps {
  isOpen: boolean;
  onClose: () => void;
  context?: string;
  persistentChatId?: string;
}

export default function VoiceAIAgent({ isOpen, onClose, context = 'general', persistentChatId = 'default' }: VoiceAIAgentProps) {
  const { locale } = useTranslations();
  const isRTL = locale === "ar";

  // ALL STATE HOOKS FIRST - FIXED ORDER
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [error, setError] = useState<string>('');
  const [conversationActive, setConversationActive] = useState(false);
  const [hasStartedConversation, setHasStartedConversation] = useState(false);
  const [isEnding, setIsEnding] = useState(false);
  
  // STABLE initial messages - useMemo to prevent re-creation
  const initialMessages = useMemo<VoiceMessage[]>(() => {
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
  }, [persistentChatId]);

  const [messages, setMessages] = useState<VoiceMessage[]>(initialMessages);

  // ALL REFS SECOND - FIXED ORDER
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const recognitionManagerRef = useRef<{
    startListening: () => void;
    stopListening: () => void;
    restartListening: () => void;
    cleanup: () => void;
  } | null>(null);

  // ALL CALLBACKS THIRD - FIXED ORDER
  const handleListeningStart = useCallback(() => {
    console.log('🎤 Listening started - updating state');
    setIsListening(true);
  }, []);

  const handleListeningEnd = useCallback(() => {
    console.log('🎤 Listening ended - updating state');
    setIsListening(false);
  }, []);

  const handleSpeakingStart = useCallback(() => {
    console.log('🔊 Speaking started');
    setIsSpeaking(true);
  }, []);

  const handleSpeakingEnd = useCallback(() => {
    console.log('🔊 Speaking ended');
    setIsSpeaking(false);
  }, []);

  const handleError = useCallback((error: string) => {
    console.log('❌ Error:', error);
    setError(error);
  }, []);

  const handleAudioLevel = useCallback((level: number) => {
    setAudioLevel(level);
  }, []);

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

  const onRestartListening = useCallback(() => {
    if (!isEnding && conversationActive && recognitionManagerRef.current) {
      console.log('🔄 Audio manager requesting restart...');
      recognitionManagerRef.current.restartListening();
    }
  }, [isEnding, conversationActive]);

  // Initialize audio manager with STABLE callbacks
  const audioManager = useVoiceAudioManager({
    locale,
    onSpeakingStart: handleSpeakingStart,
    onSpeakingEnd: handleSpeakingEnd,
    onRestartListening
  });

  const endConversation = useCallback(async () => {
    console.log('👋 Starting conversation end sequence...');
    setIsEnding(true);
    
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
    
    console.log('👋 Playing goodbye message with Navi voice...');
    await audioManager.speakWithElevenLabs(farewellMessage, true);
    
    setTimeout(() => {
      console.log('👋 Conversation ended, closing...');
      setConversationActive(false);
      setHasStartedConversation(false);
      setIsEnding(false);
      onClose();
    }, 2000);
  }, [locale, audioManager, onClose]);

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

    if (checkForGoodbye(transcript)) {
      console.log('👋 Goodbye detected, ending conversation...');
      setIsProcessing(false);
      await endConversation();
      return;
    }

    try {
      const baseUrl = window.location.origin;
      const apiUrl = `${baseUrl}/api/voice-chat`; // FIXED: Use voice-chat endpoint
      
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
        content: data.reply || "I'm sorry, I didn't understand that. Could you try again?", // FIXED: Use 'reply' field
        timestamp: Date.now(),
        id: 'assistant-' + Date.now(),
        type: 'text'
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsProcessing(false);
      
      const responseContent = data.reply || aiMessage.content; // FIXED: Use 'reply' field
      
      if (checkForGoodbye(responseContent)) {
        console.log('👋 AI goodbye detected, ending conversation...');
        await endConversation();
      } else {
        console.log('🔊 Playing AI response with Navi voice...');
        await audioManager.speakWithElevenLabs(responseContent, false);
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
      
      console.log('🔊 Playing error message with female voice...');
      await audioManager.speakWithElevenLabs(errorMessage, false);
    }
  }, [context, locale, messages, checkForGoodbye, endConversation, audioManager]);

  // Initialize recognition manager - ALWAYS CALLED IN SAME ORDER
  const recognitionManager = useVoiceRecognitionManager({
    locale,
    isEnding,
    isSpeaking,
    conversationActive,
    autoListenMode: true,
    onListeningStart: handleListeningStart,
    onListeningEnd: handleListeningEnd,
    onTranscript: handleVoiceInput,
    onError: handleError,
    onAudioLevel: handleAudioLevel
  });

  const handleMicButtonClick = useCallback(() => {
    console.log('🎤 Mic button clicked');
    console.log('🎤 Current state - isListening:', isListening, 'isSpeaking:', isSpeaking, 'isEnding:', isEnding);
    console.log('🎤 Recognition manager available:', !!recognitionManagerRef.current);
    
    setError('');
    
    if (!recognitionManagerRef.current) {
      console.error('❌ Recognition manager not initialized');
      setError('Voice recognition not ready. Please refresh the page and try again.');
      return;
    }
    
    if (isListening) {
      console.log('🛑 Stopping listening...');
      recognitionManagerRef.current.stopListening();
    } else {
      console.log('🎤 Starting listening...');
      setConversationActive(true);
      setHasStartedConversation(true);
      recognitionManagerRef.current.startListening();
    }
  }, [isListening, isSpeaking, isEnding]);

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
    
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(`navi-chat-${persistentChatId}`);
      } catch (err) {
        console.error('Error clearing chat history:', err);
      }
    }
  }, [persistentChatId]);

  const handleGoodbyeClick = useCallback(async () => {
    console.log('👋 Manual goodbye clicked');
    await endConversation();
  }, [endConversation]);

  // ALL EFFECTS LAST - FIXED ORDER
  // Store recognitionManager in ref - STABLE with fewer re-renders
  useEffect(() => {
    console.log('🔧 Setting recognition manager ref:', !!recognitionManager);
    recognitionManagerRef.current = recognitionManager;
  }, [recognitionManager]);

  // Save messages to localStorage - STABLE
  useEffect(() => {
    if (typeof window !== 'undefined' && messages.length > 0) {
      try {
        localStorage.setItem(`navi-chat-${persistentChatId}`, JSON.stringify(messages));
      } catch (error) {
        console.error('Error saving chat history:', error);
      }
    }
  }, [messages, persistentChatId]);

  // Auto-scroll to bottom - STABLE
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ONLY cleanup on unmount - no dependencies to prevent re-renders
  useEffect(() => {
    return () => {
      console.log('🧹 Component unmounting - cleaning up...');
      if (recognitionManagerRef.current) {
        recognitionManagerRef.current.cleanup();
      }
      audioManager.cleanup();
    };
  }, []); // Empty array - only cleanup on unmount

  // Early return if not open - AFTER ALL HOOKS
  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-50 ${isRTL ? 'font-arabic' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
      
      {/* Voice Agent Interface */}
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

            {/* Messages Area - Using VoiceMessagesList component */}
            <VoiceMessagesList 
              messages={messages} 
              messagesEndRef={messagesEndRef} 
            />

            {/* Controls */}
            <div className="p-3 bg-white border-t">
              {/* Status Display - Using VoiceStatusIndicator component */}
              <div className="mb-3">
                <VoiceStatusIndicator
                  error={error}
                  isProcessing={isProcessing}
                  isListening={isListening}
                  isSpeaking={isSpeaking}
                  isEnding={isEnding}
                  audioLevel={audioLevel}
                />
              </div>

              {/* Control Buttons - Using VoiceControls component */}
              <VoiceControls
                isListening={isListening}
                isSpeaking={isSpeaking}
                isProcessing={isProcessing}
                isEnding={isEnding}
                onMicClick={handleMicButtonClick}
                onClearChat={clearChat}
                onGoodbyeClick={handleGoodbyeClick}
                onStopSpeaking={audioManager.stopSpeaking}
              />

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