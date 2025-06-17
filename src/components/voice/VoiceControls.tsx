"use client";

import React from "react";
import { Mic, MicOff, Square, Trash2, Phone } from "lucide-react";

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
  
  // ULTRA SIMPLIFIED: Just the essential buttons for SPEED
  return (
    <div className="flex items-center justify-between gap-2">
      
      {/* PRIMARY ACTION: Mic Button - Large and Prominent */}
      <button
        onClick={onMicClick}
        disabled={isProcessing || isEnding}
        className={`
          flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-all duration-200
          ${isListening 
            ? 'bg-red-500 hover:bg-red-600 text-white' 
            : 'bg-[#4083b7] hover:bg-[#3474ac] text-white'
          }
          ${(isProcessing || isEnding) ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'}
        `}
      >
        {isListening ? (
          <>
            <MicOff className="w-5 h-5" />
            <span>Stop</span>
          </>
        ) : (
          <>
            <Mic className="w-5 h-5" />
            <span>Talk</span>
          </>
        )}
      </button>

      {/* SECONDARY ACTIONS: Small buttons */}
      <div className="flex gap-1">
        
        {/* Stop Speaking - Only show when speaking */}
        {isSpeaking && (
          <button
            onClick={onStopSpeaking}
            className="p-2 bg-orange-100 hover:bg-orange-200 text-orange-600 rounded-lg transition-colors"
            title="Stop Speaking"
          >
            <Square className="w-4 h-4" />
          </button>
        )}

        {/* Clear Chat */}
        <button
          onClick={onClearChat}
          disabled={isProcessing || isEnding}
          className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition-colors disabled:opacity-50"
          title="Clear Chat"
        >
          <Trash2 className="w-4 h-4" />
        </button>

        {/* End Conversation */}
        <button
          onClick={onGoodbyeClick}
          disabled={isProcessing || isEnding}
          className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-colors disabled:opacity-50"
          title="End Conversation"
        >
          <Phone className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}