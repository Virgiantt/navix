"use client";

import { ReactNode, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PiMicrophone } from 'react-icons/pi';

import Navbar from './sections/Navbar';
import Footer from './sections/Footer';
import VoiceAIAgent from './VoiceAIAgent';
import { useTranslations } from '@/hooks/useTranslations';

export default function MainLayout({ children }: { children: ReactNode }) {
  const [isVoiceAgentOpen, setIsVoiceAgentOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);
  const { t } = useTranslations();

  // Hide tooltip after 3 seconds (reduced from 5)
  useEffect(() => {
    const timer = setTimeout(() => setShowTooltip(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="flex-1 pt-18 md:mt-10">{children}</main>
      
      {/* MOBILE-OPTIMIZED Voice AI Agent Button */}
      <div className="fixed bottom-4 right-4 z-40">
        {/* Simplified tooltip for mobile */}
        <AnimatePresence>
          {showTooltip && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute bottom-14 right-0 bg-white px-3 py-2 rounded-lg shadow-lg border whitespace-nowrap"
            >
              <div className="text-xs font-medium text-gray-800 flex items-center gap-1">
                🎤 Tap to talk with NAvi
              </div>
              {/* Simple arrow pointer */}
              <div className="absolute -bottom-1 right-3 w-2 h-2 bg-white border-r border-b border-gray-200 transform rotate-45"></div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Simplified floating button - better mobile performance */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            setIsVoiceAgentOpen(true);
            setShowTooltip(false);
          }}
          className="relative w-14 h-14 bg-gradient-to-br from-[#4083b7] to-[#3474ac] text-white rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300 flex items-center justify-center group"
          title="Talk to NAvi Assistant"
        >          
          {/* Single pulse ring for better performance */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-[#4083b7]/40"
            animate={{ 
              scale: [1, 1.4],
              opacity: [0.6, 0]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: "easeOut"
            }}
          />
          
          {/* Main microphone icon */}
          <PiMicrophone className="text-xl relative z-10" />

          {/* Active indicator dot */}
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white">
            <div className="w-full h-full bg-green-400 rounded-full animate-ping"></div>
          </div>
        </motion.button>
      </div>

      {/* Voice AI Agent Modal */}
      <VoiceAIAgent 
        isOpen={isVoiceAgentOpen} 
        onClose={() => setIsVoiceAgentOpen(false)}
        context="general"
      />
      
      <Footer />
    </div>
  );
}