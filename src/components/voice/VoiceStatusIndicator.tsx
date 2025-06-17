"use client";

import React from "react";
import { Mic, MicOff, Volume2, AlertCircle, Loader2 } from "lucide-react";

interface VoiceStatusIndicatorProps {
  error: string;
  isProcessing: boolean;
  isListening: boolean;
  isSpeaking: boolean;
  isEnding: boolean;
  audioLevel: number;
  isProcessingAudio?: boolean; // NEW: Audio processing state
}

export default function VoiceStatusIndicator({ 
  error, 
  isProcessing, 
  isListening, 
  isSpeaking, 
  isEnding, 
  audioLevel, 
  isProcessingAudio 
}: VoiceStatusIndicatorProps) {
  
  // ULTRA SIMPLIFIED: One line status with minimal UI for SPEED
  if (error) {
    return (
      <div className="flex items-center gap-2 p-2 bg-red-50 rounded-lg">
        <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
        <span className="text-sm text-red-700 truncate">{error}</span>
      </div>
    );
  }

  if (isEnding) {
    return (
      <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
        <Loader2 className="w-4 h-4 text-gray-500 animate-spin" />
        <span className="text-sm text-gray-700">Goodbye...</span>
      </div>
    );
  }

  // NEW: Show audio processing state when converting speech to text
  if (isProcessingAudio) {
    return (
      <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded-lg">
        <Loader2 className="w-4 h-4 text-yellow-500 animate-spin" />
        <span className="text-sm text-yellow-700">Converting speech...</span>
        {/* Simple dots animation */}
        <div className="flex gap-1 ml-auto">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="w-1 h-1 bg-yellow-500 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (isProcessing) {
    return (
      <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
        <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
        <span className="text-sm text-blue-700">Processing...</span>
      </div>
    );
  }

  if (isSpeaking) {
    return (
      <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
        <Volume2 className="w-4 h-4 text-green-500" />
        <span className="text-sm text-green-700">NAvi speaking...</span>
        {/* SIMPLE 3-dot animation for speed */}
        <div className="flex gap-1 ml-auto">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="w-1 h-3 bg-green-500 rounded-full animate-pulse"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (isListening) {
    return (
      <div className="flex items-center gap-2 p-2 bg-red-50 rounded-lg">
        <Mic className="w-4 h-4 text-red-500" />
        <span className="text-sm text-red-700">Listening...</span>
        {/* FAST Audio level bars - only 3 bars for speed */}
        <div className="flex gap-1 ml-auto">
          {[0.3, 0.6, 0.9].map((threshold, i) => (
            <div
              key={i}
              className={`w-1 h-3 rounded-full transition-colors duration-100 ${
                audioLevel > threshold ? 'bg-red-500' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    );
  }

  // Default ready state - MINIMAL
  return (
    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
      <MicOff className="w-4 h-4 text-gray-400" />
      <span className="text-sm text-gray-600">Ready</span>
    </div>
  );
}