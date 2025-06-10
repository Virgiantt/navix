"use client";

import React from "react";
import { Volume2 } from "lucide-react";

interface VoiceStatusIndicatorProps {
  error: string;
  isProcessing: boolean;
  isListening: boolean;
  isSpeaking: boolean;
  isEnding: boolean;
  audioLevel: number;
}

export default function VoiceStatusIndicator({ 
  error, 
  isProcessing, 
  isListening, 
  isSpeaking, 
  isEnding, 
  audioLevel 
}: VoiceStatusIndicatorProps) {
  if (error) {
    return (
      <div className="flex items-center gap-2 p-2 bg-red-50 border border-red-200 rounded-lg">
        <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0" />
        <p className="text-red-700 text-xs">{error}</p>
      </div>
    );
  }

  if (isProcessing) {
    return (
      <div className="flex items-center gap-2 p-2 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin flex-shrink-0" />
        <p className="text-blue-700 text-xs">Processing...</p>
      </div>
    );
  }

  if (isListening) {
    return (
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
    );
  }

  if (isSpeaking) {
    return (
      <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded-lg">
        <Volume2 className="w-3 h-3 text-green-600 animate-pulse flex-shrink-0" />
        <p className="text-green-700 text-xs font-medium">NAvi is speaking...</p>
      </div>
    );
  }

  if (isEnding) {
    return (
      <div className="flex items-center gap-2 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="w-2 h-2 bg-yellow-500 rounded-full flex-shrink-0" />
        <p className="text-yellow-700 text-xs">Ending conversation...</p>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 p-2 bg-blue-50 border border-blue-200 rounded-lg">
      <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
      <p className="text-blue-700 text-xs">Ready to listen - start talking!</p>
    </div>
  );
}