"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PiSparkle, PiCalendarCheck } from "react-icons/pi";
import Confetti from "./Confetti";

type ConversationMessage = { 
  role: 'user' | 'assistant'; 
  content: string; 
};

type ConversationState = {
  category: string;
  questionCount: number;
  isComplete: boolean;
  needsContactInfo: boolean;
  userResponses: Record<string, string>;
};

type ContactInfo = {
  fullName: string;
  email: string;
  phone: string;
};

const services = [
  {
    id: 'marketing-strategy',
    title: 'Marketing Strategy',
    description: 'Growth marketing, campaigns & analytics',
    icon: '📈'
  },
  {
    id: 'video-editing',
    title: 'Video Editing',
    description: 'Video production & motion graphics',
    icon: '🎬'
  },
  {
    id: 'development',
    title: 'Development',
    description: 'Web development & full-stack solutions',
    icon: '💻'
  },
  {
    id: 'ux-ui',
    title: 'UX/UI',
    description: 'User experience & interface design',
    icon: '🎨'
  },
  {
    id: 'branding',
    title: 'Branding',
    description: 'Brand identity & visual systems',
    icon: '✨'
  }
];

export default function AIContactForm() {
  const [selectedService, setSelectedService] = useState<string>('');
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversationState, setConversationState] = useState<ConversationState>({
    category: '',
    questionCount: 0,
    isComplete: false,
    needsContactInfo: false,
    userResponses: {}
  });
  const [error, setError] = useState<string | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false);
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    fullName: '',
    email: '',
    phone: ''
  });
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const celebrationRef = useRef<HTMLDivElement>(null);
  const contactFormRef = useRef<HTMLDivElement>(null);

  // Remove the auto-scroll effect for regular messages - no longer needed
  // useEffect(() => {
  //   if (messagesEndRef.current) {
  //     messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  //   }
  // }, [messages]);

  // Show contact form when AI conversation is complete but contact info not collected
  useEffect(() => {
    if (conversationState.isComplete && !showContactForm && !formSubmitted) {
      setShowContactForm(true);
    }
  }, [conversationState.isComplete, showContactForm, formSubmitted]);

  // Auto-scroll to contact form when conversation completes
  useEffect(() => {
    if (showContactForm && contactFormRef.current) {
      setTimeout(() => {
        contactFormRef.current?.scrollIntoView({ 
          behavior: "smooth", 
          block: "start",
          inline: "nearest"
        });
      }, 300); // Small delay to let the form render
    }
  }, [showContactForm]);

  // Trigger celebration when form is submitted
  useEffect(() => {
    if (formSubmitted && !showCelebration) {
      setShowCelebration(true);
      // Auto-hide celebration after 3 seconds
      const timer = setTimeout(() => {
        setShowCelebration(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [formSubmitted, showCelebration]);

  // Scroll to celebration message when it appears
  useEffect(() => {
    if (formSubmitted && celebrationRef.current) {
      setTimeout(() => {
        celebrationRef.current?.scrollIntoView({ 
          behavior: "smooth", 
          block: "center" 
        });
      }, 500);
    }
  }, [formSubmitted]);

  const handleServiceSelect = async (serviceId: string) => {
    setSelectedService(serviceId);
    const service = services.find(s => s.id === serviceId);
    if (!service) return;

    const initialState = {
      category: serviceId,
      questionCount: 0,
      isComplete: false,
      needsContactInfo: false,
      userResponses: {}
    };

    setConversationState(initialState);
    setMessages([]);
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/contact-conversation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `I'm interested in ${service.title} services.`,
          history: [],
          conversationState: initialState
        })
      });

      if (!res.ok) throw new Error('Failed to start conversation');
      
      const data = await res.json();
      setMessages([{ role: 'assistant', content: data.reply }]);
      setConversationState(data.conversationState);
    } catch {
      setError('Sorry, something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInput('');
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/contact-conversation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          history: messages,
          conversationState
        })
      });

      if (!res.ok) throw new Error('Failed to get response');
      
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
      setConversationState(data.conversationState);
    } catch {
      setError('Sorry, something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !loading) {
      sendMessage();
    }
  };

  const resetForm = () => {
    setSelectedService('');
    setMessages([]);
    setInput('');
    setConversationState({
      category: '',
      questionCount: 0,
      isComplete: false,
      needsContactInfo: false,
      userResponses: {}
    });
    setError(null);
  };

  const openCalendly = () => {
    setIsCalendlyOpen(true);
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactInfo.fullName.trim() || !contactInfo.email.trim()) return;

    setIsSubmittingForm(true);
    setError(null);

    try {
      // Prepare conversation history for submission - Fixed logic
      const conversationHistory: Array<{ question: string; answer: string }> = [];
      
      // Process messages in pairs: AI question followed by user answer
      for (let i = 0; i < messages.length - 1; i++) {
        const currentMessage = messages[i];
        const nextMessage = messages[i + 1];
        
        // If current is AI and next is user, it's a Q&A pair
        if (currentMessage.role === 'assistant' && nextMessage.role === 'user') {
          conversationHistory.push({
            question: currentMessage.content,
            answer: nextMessage.content
          });
        }
      }

      console.log('Conversation History:', conversationHistory); // Debug log

      const submission = {
        service: services.find(s => s.id === selectedService)?.title || selectedService,
        contactInfo: {
          fullName: contactInfo.fullName.trim(),
          email: contactInfo.email.trim(),
          phone: contactInfo.phone.trim() || undefined
        },
        conversationHistory,
        submittedAt: new Date().toISOString()
      };

      const response = await fetch('/api/submit-contact-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submission)
      });

      if (!response.ok) throw new Error('Submission failed');

      setFormSubmitted(true);
      setShowContactForm(false);
    } catch {
      setError('Sorry, something went wrong. Please try again or contact us directly.');
    } finally {
      setIsSubmittingForm(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Confetti Animation */}
      {showCelebration && <Confetti />}
      
      {/* Modern Calendly Modal */}
      <AnimatePresence>
        {isCalendlyOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsCalendlyOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
              className="bg-white rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-2xl border border-gray-200"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modern Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-lochmara-50 to-blue-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-lochmara-500 to-lochmara-600 rounded-full flex items-center justify-center">
                    <PiCalendarCheck className="text-white text-xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Schedule Your Strategy Call</h3>
                    <p className="text-sm text-gray-600">Let&apos;s discuss your project and goals</p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsCalendlyOpen(false)}
                  className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors group"
                >
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              </div>

              {/* Calendly Content */}
              <div className="relative">
                <iframe
                  src="https://calendly.com/houssemdaas2/30min"
                  className="w-full h-[600px] md:h-[650px]"
                  frameBorder="0"
                  title="Schedule a call"
                />
                
                {/* Mobile-friendly overlay hint */}
                <div className="absolute top-4 left-4 right-4 md:hidden">
                  <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 text-sm text-gray-600 border border-gray-200 shadow-sm">
                    💡 Tip: Scroll within the calendar to see all available times
                  </div>
                </div>
              </div>

              {/* Footer with contact alternatives */}
              <div className="p-6 bg-gray-50 border-t border-gray-100">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-sm text-gray-600 text-center sm:text-left">
                    Having trouble? Contact us directly
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <a
                      href="mailto:contact@navix.com"
                      className="px-4 py-2 text-sm font-medium text-lochmara-600 hover:text-lochmara-700 hover:bg-lochmara-50 rounded-lg transition-colors"
                    >
                      📧 Email us
                    </a>
                    <a
                      href="tel:50699724"
                      className="px-4 py-2 text-sm font-medium text-lochmara-600 hover:text-lochmara-700 hover:bg-lochmara-50 rounded-lg transition-colors"
                    >
                      📞 Call us
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {!selectedService ? (
          // Service Selection Screen
          <motion.div
            key="service-selection"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
                <PiSparkle className="text-lochmara-500" />
                What can we help you with?
              </h3>
              <p className="text-gray-600">
                Choose a service to start a quick conversation about your project
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {services.map((service) => (
                <motion.button
                  key={service.id}
                  onClick={() => handleServiceSelect(service.id)}
                  className="p-6 bg-white border-2 border-gray-200 rounded-xl hover:border-lochmara-500 hover:shadow-lg transition-all duration-200 text-left group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-start gap-4">
                    <span className="text-3xl">{service.icon}</span>
                    <div>
                      <h4 className="font-semibold text-lg group-hover:text-lochmara-500 transition-colors">
                        {service.title}
                      </h4>
                      <p className="text-gray-600 text-sm mt-1">
                        {service.description}
                      </p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        ) : (
          // Conversation Screen
          <motion.div
            key="conversation"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-lochmara-50 rounded-xl">
              <div className="flex items-center gap-3">
                <span className="text-2xl">
                  {services.find(s => s.id === selectedService)?.icon}
                </span>
                <div>
                  <h3 className="font-semibold">
                    {services.find(s => s.id === selectedService)?.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Question {conversationState.questionCount} of 6
                  </p>
                </div>
              </div>
              <button
                onClick={resetForm}
                className="text-sm text-gray-500 hover:text-gray-700 underline"
              >
                Change Service
              </button>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-lochmara-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(conversationState.questionCount / 6) * 100}%` }}
              />
            </div>

            {/* Messages */}
            <div className="bg-white border rounded-xl p-6 min-h-[400px] max-h-[500px] overflow-y-auto">
              <div className="space-y-4">
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={msg.role === 'user' ? 'flex justify-end' : 'flex justify-start'}
                  >
                    <div
                      className={
                        msg.role === 'user'
                          ? 'bg-lochmara-500 text-white rounded-2xl px-4 py-3 max-w-[80%] rounded-br-md'
                          : 'bg-gray-100 text-gray-800 rounded-2xl px-4 py-3 max-w-[80%] rounded-bl-md'
                      }
                    >
                      {msg.content}
                    </div>
                  </motion.div>
                ))}
                
                {/* Celebration Message */}
                {conversationState.isComplete && (
                  <motion.div
                    ref={celebrationRef}
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ 
                      duration: 0.6,
                      type: "spring",
                      bounce: 0.4,
                      delay: 0.3
                    }}
                    className="flex justify-center my-8"
                  >
                    <div className="text-center space-y-4 p-6 bg-gradient-to-br from-lochmara-50 to-blue-50 rounded-2xl border border-lochmara-200 max-w-sm">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ 
                          delay: 0.6,
                          type: "spring",
                          bounce: 0.6
                        }}
                        className="text-6xl mb-2"
                      >
                        🎉
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                      >
                        <h3 className="text-xl font-bold text-lochmara-700 mb-2">
                          Thanks for choosing Navix!
                        </h3>
                        <p className="text-lochmara-600 text-sm">
                          We&apos;re excited to explore your project and help bring your vision to life.
                        </p>
                      </motion.div>
                    </div>
                  </motion.div>
                )}
                
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-2xl px-4 py-3 rounded-bl-md">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Input Area or Call to Action */}
            {showContactForm ? (
              // Contact Information Form
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="p-6 bg-gradient-to-br from-lochmara-50 to-blue-50 rounded-2xl border border-lochmara-200"
                ref={contactFormRef}
              >
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-lochmara-700 mb-2">
                    🎯 Almost there!
                  </h3>
                  <p className="text-lochmara-600 text-sm">
                    Just a few details so we can follow up with your personalized strategy
                  </p>
                </div>

                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={contactInfo.fullName}
                        onChange={(e) => setContactInfo({ ...contactInfo, fullName: e.target.value })}
                        placeholder="Your full name"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-lochmara-500 focus:border-transparent bg-white"
                        required
                        disabled={isSubmittingForm}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        value={contactInfo.email}
                        onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                        placeholder="your@email.com"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-lochmara-500 focus:border-transparent bg-white"
                        required
                        disabled={isSubmittingForm}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone / WhatsApp <span className="text-gray-400">(optional)</span>
                    </label>
                    <input
                      type="tel"
                      value={contactInfo.phone}
                      onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                      placeholder="+1 (555) 123-4567"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-lochmara-500 focus:border-transparent bg-white"
                      disabled={isSubmittingForm}
                    />
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <motion.button
                      type="submit"
                      disabled={isSubmittingForm || !contactInfo.fullName.trim() || !contactInfo.email.trim()}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 px-6 py-4 bg-gradient-to-r from-lochmara-500 to-lochmara-600 text-white rounded-xl hover:from-lochmara-600 hover:to-lochmara-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-semibold text-lg flex items-center justify-center gap-2"
                    >
                      {isSubmittingForm ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          ✨ Submit & Get Strategy
                        </>
                      )}
                    </motion.button>
                    <button
                      type="button"
                      onClick={() => setShowContactForm(false)}
                      className="sm:w-auto px-6 py-4 bg-white text-gray-600 rounded-xl hover:bg-gray-50 transition-colors border border-gray-300"
                    >
                      Skip for now
                    </button>
                  </div>
                </form>
              </motion.div>
            ) : formSubmitted ? (
              // Celebration and Schedule Button (after form submission)
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.5 }}
                className="space-y-4"
              >
                {/* Schedule Call Button */}
                <motion.button
                  onClick={openCalendly}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-lochmara-500 to-lochmara-600 text-white py-4 md:py-5 px-6 rounded-2xl font-bold text-lg md:text-xl hover:from-lochmara-600 hover:to-lochmara-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 group"
                >
                  <PiCalendarCheck className="text-2xl group-hover:scale-110 transition-transform" />
                  Schedule Your Strategy Call
                </motion.button>

                {/* Alternative Options */}
                <div className="flex flex-col sm:flex-row gap-3 text-center">
                  <button
                    onClick={resetForm}
                    className="flex-1 text-sm text-gray-500 hover:text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Start Over
                  </button>
                  <a
                    href="mailto:contact@navix.com"
                    className="flex-1 text-sm text-lochmara-600 hover:text-lochmara-700 py-3 px-4 rounded-xl hover:bg-lochmara-50 transition-colors font-medium"
                  >
                    Email Us Instead
                  </a>
                </div>
              </motion.div>
            ) : conversationState.isComplete ? (
              // Just show contact form prompt if conversation complete but no form shown yet
              <div className="text-center p-6 bg-lochmara-50 rounded-xl">
                <p className="text-lochmara-600">
                  Preparing your contact form...
                </p>
              </div>
            ) : (
              // Regular message input
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your answer..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-lochmara-500 focus:border-transparent"
                  disabled={loading}
                />
                <button
                  onClick={sendMessage}
                  disabled={loading || !input.trim()}
                  className="px-6 py-3 bg-lochmara-500 text-white rounded-xl hover:bg-lochmara-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Send
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}