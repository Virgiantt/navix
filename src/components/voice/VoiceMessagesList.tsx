"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export type VoiceMessage = { 
  role: 'user' | 'assistant'; 
  content: string; 
  timestamp: number;
  id?: string;
  type?: 'text' | 'project' | 'system';
};

interface VoiceMessagesListProps {
  messages: VoiceMessage[];
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

export default function VoiceMessagesList({ messages, messagesEndRef }: VoiceMessagesListProps) {
  return (
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
  );
}