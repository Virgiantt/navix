"use client";

import React, { useState, useEffect } from "react";
import { Volume2, Mic } from "lucide-react";

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
  const [speakingTimer, setSpeakingTimer] = useState(0);
  const [processingDots, setProcessingDots] = useState('');

  // Speaking timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isSpeaking) {
      setSpeakingTimer(0);
      interval = setInterval(() => {
        setSpeakingTimer(prev => prev + 1);
      }, 1000);
    } else {
      setSpeakingTimer(0);
    }
    return () => clearInterval(interval);
  }, [isSpeaking]);

  // Processing dots animation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isProcessing) {
      interval = setInterval(() => {
        setProcessingDots(prev => {
          if (prev.length >= 3) return '';
          return prev + '.';
        });
      }, 500);
    } else {
      setProcessingDots('');
    }
    return () => clearInterval(interval);
  }, [isProcessing]);

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
        <div className="flex flex-col">
          <p className="text-blue-700 text-xs font-medium">Processing your request{processingDots}</p>
          <p className="text-blue-600 text-xs opacity-75">NAvi is preparing to speak...</p>
        </div>
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
    const formatTime = (seconds: number) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return mins > 0 ? `${mins}:${secs.toString().padStart(2, '0')}` : `${secs}s`;
    };

    return (
      <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded-lg">
        <Volume2 className="w-3 h-3 text-green-600 animate-pulse flex-shrink-0" />
        <div className="flex flex-col flex-1">
          <div className="flex items-center justify-between">
            <p className="text-green-700 text-xs font-medium">NAvi is speaking...</p>
            <span className="text-green-600 text-xs font-mono">{formatTime(speakingTimer)}</span>
          </div>
          <div className="w-full bg-green-100 rounded-full h-1 mt-1">
            <div className="bg-green-500 h-1 rounded-full animate-pulse" style={{ width: '60%' }} />
          </div>
        </div>
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
      <Mic className="w-3 h-3 text-blue-500 animate-pulse flex-shrink-0" />
      <div className="flex flex-col">
        <p className="text-blue-700 text-xs font-medium">Tap the microphone to start talking</p>
        <p className="text-blue-600 text-xs opacity-75">NAvi is ready to listen and respond</p>
      </div>
    </div>
  );
}