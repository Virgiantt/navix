"use client";

import { ReactNode, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PiMicrophone, PiWaveform, PiSparkle } from 'react-icons/pi';

import Navbar from './sections/Navbar';
import Footer from './sections/Footer';
import VoiceAIAgent from './VoiceAIAgent';
import { useTranslations } from '@/hooks/useTranslations';

export default function MainLayout({ children }: { children: ReactNode }) {
  const [isVoiceAgentOpen, setIsVoiceAgentOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);
  const { t } = useTranslations();

  // Hide tooltip after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowTooltip(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="flex-1 pt-18 md:mt-10 ">{children}</main>
      
      {/* Voice AI Agent Button - Enhanced Floating */}
      <div className="fixed bottom-6 right-6 z-40">
        {/* Tooltip/Call-to-action bubble */}
        <AnimatePresence>
          {showTooltip && (
            <motion.div
              initial={{ opacity: 0, x: 20, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.8 }}
              className="absolute bottom-16 right-0 bg-white dark:bg-gray-800 px-3 py-2 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 whitespace-nowrap"
            >
              <div className="text-sm font-medium text-gray-800 dark:text-gray-200 flex items-center gap-2">
                <PiSparkle className="text-lochmara-500" />
                {t('VoiceAIAgent.tapToSpeak')}
              </div>
              {/* Arrow pointer */}
              <div className="absolute -bottom-1 right-4 w-2 h-2 bg-white dark:bg-gray-800 border-r border-b border-gray-200 dark:border-gray-700 transform rotate-45"></div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            setIsVoiceAgentOpen(true);
            setShowTooltip(false);
          }}
          className="relative w-16 h-16 bg-gradient-to-br from-lochmara-500 via-lochmara-600 to-lochmara-700 text-white rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 flex items-center justify-center group overflow-hidden"
          title={t('VoiceAIAgent.tapToSpeak')}
        >
          {/* Gradient glow effect */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-lochmara-400 to-lochmara-600 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
          
          {/* Multiple pulse rings */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-lochmara-400"
            animate={{ 
              scale: [1, 1.5, 2],
              opacity: [0.6, 0.3, 0]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: "easeOut",
              delay: 0
            }}
          />
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-lochmara-300"
            animate={{ 
              scale: [1, 1.8, 2.5],
              opacity: [0.4, 0.2, 0]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: "easeOut",
              delay: 0.5
            }}
          />
          
          {/* Main icon with breathing animation */}
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity, 
              ease: "easeInOut"
            }}
            className="relative z-10"
          >
            <PiMicrophone className="text-2xl" />
          </motion.div>

          {/* Sound wave indicators */}
          <motion.div
            className="absolute right-1 top-1/2 transform -translate-y-1/2"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <PiWaveform className="text-xs text-white/70" />
          </motion.div>

          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: "linear",
              repeatDelay: 1
            }}
          />

          {/* Active indicator dot */}
          <motion.div
            className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white shadow-sm"
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.8, 1, 0.8]
            }}
            transition={{ 
              duration: 1, 
              repeat: Infinity, 
              ease: "easeInOut"
            }}
          />
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