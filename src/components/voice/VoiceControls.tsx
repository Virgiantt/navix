"use client";

import React from "react";
import { Mic, MicOff, VolumeX, Trash2, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface VoiceControlsProps {
  isListening: boolean;
  isSpeaking: boolean;
  isProcessing: boolean;
  isEnding: boolean;
  onMicClick: () => void;
  onClearChat: () => void;
  onGoodbyeClick: () => void;
  onStopSpeaking: () => void;
}

export default function VoiceControls({
  isListening,
  isSpeaking,
  isProcessing,
  isEnding,
  onMicClick,
  onClearChat,
  onGoodbyeClick,
  onStopSpeaking
}: VoiceControlsProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        {/* Clear Chat */}
        <button
          onClick={onClearChat}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Clear chat"
          disabled={isEnding}
        >
          <Trash2 className="w-4 h-4 text-gray-500" />
        </button>

        {/* Goodbye Button */}
        <button
          onClick={onGoodbyeClick}
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
        onClick={onMicClick}
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
            <VolumeX className="w-5 h-5 text-white" onClick={onStopSpeaking} />
          ) : (
            <Mic className="w-5 h-5 text-white" />
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}