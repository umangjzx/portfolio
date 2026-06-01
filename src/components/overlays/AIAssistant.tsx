import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePortfolioStore } from '../../store/portfolioStore';
import { aiResponder } from '../../services/aiResponder';
import type { ChatMessage } from '../../types';

export function AIAssistant() {
  const { isAIOpen, toggleAI } = usePortfolioStore();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (messagesEndRef.current && typeof messagesEndRef.current.scrollIntoView === 'function') {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    if (isAIOpen) {
      setTimeout(() => inputRef.current?.focus(), 350);
    }
  }, [isAIOpen]);

  const handleSend = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed || isProcessing) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: trimmed,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsProcessing(true);

    setTimeout(() => {
      const response = aiResponder.respond(trimmed);
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: response.content,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsProcessing(false);
    }, 800);
  }, [input, isProcessing]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-6 right-4 sm:right-6 z-50">
      <AnimatePresence mode="wait">
        {!isAIOpen ? (
          <motion.button
            key="orb"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={toggleAI}
            className="relative w-14 h-14 rounded-full cursor-pointer bg-white shadow-[0_10px_30px_rgba(0,0,0,0.1)] border border-gray-100 flex items-center justify-center hover:scale-110 transition-transform duration-300"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-900">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            <div className="absolute top-0 right-0 w-3 h-3 bg-blue-500 rounded-full border-2 border-white"></div>
          </motion.button>
        ) : (
          <motion.div
            key="chat"
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="w-[calc(100vw-32px)] sm:w-[360px] h-[500px] max-h-[80vh] rounded-3xl flex flex-col overflow-hidden bg-white/90 backdrop-blur-xl border border-gray-200 shadow-[0_30px_60px_rgba(0,0,0,0.1)]"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-white/50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-900">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M12 2v2" />
                    <path d="M12 20v2" />
                    <path d="M4.93 4.93l1.41 1.41" />
                    <path d="M17.66 17.66l1.41 1.41" />
                    <path d="M2 12h2" />
                    <path d="M20 12h2" />
                    <path d="M4.93 19.07l1.41-1.41" />
                    <path d="M17.66 6.34l1.41-1.41" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 leading-tight">AI Assistant</h3>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block"></span> Online
                  </p>
                </div>
              </div>
              <button onClick={toggleAI} className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 bg-gray-50/50">
              {messages.length === 0 && (
                <div className="text-center py-10">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                    </svg>
                  </div>
                  <h4 className="text-sm font-bold text-gray-900 mb-1">How can I help?</h4>
                  <p className="text-xs text-gray-500">Ask me about Umang's skills, projects, or experience.</p>
                </div>
              )}
              {messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} />
              ))}
              {isProcessing && (
                <div className="flex justify-start">
                  <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-white border border-gray-100 shadow-sm text-gray-500 text-sm">
                    <TypingIndicator />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="px-4 py-4 border-t border-gray-100 bg-white">
              <div className="flex items-center gap-2 rounded-full px-4 py-2 bg-gray-50 border border-gray-200 focus-within:border-gray-400 focus-within:ring-2 focus-within:ring-gray-100 transition-all">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask a question..."
                  className="flex-1 bg-transparent outline-none text-sm text-gray-900 placeholder:text-gray-400"
                  disabled={isProcessing}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isProcessing}
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-all bg-black text-white disabled:opacity-30"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 2L11 13" />
                    <path d="M22 2L15 22L11 13L2 9L22 2Z" />
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user';
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[85%] px-4 py-3 text-sm leading-relaxed shadow-sm ${isUser ? 'bg-black text-white rounded-2xl rounded-tr-sm' : 'bg-white border border-gray-100 text-gray-700 rounded-2xl rounded-tl-sm'}`}>
        {isUser ? message.content : <AnimatedText text={message.content} />}
      </div>
    </motion.div>
  );
}

function AnimatedText({ text }: { text: string }) {
  const [displayedLength, setDisplayedLength] = useState(0);

  useEffect(() => {
    setDisplayedLength(0);
    const interval = setInterval(() => {
      setDisplayedLength((prev) => {
        if (prev >= text.length) { clearInterval(interval); return prev; }
        return prev + 1;
      });
    }, 20);
    return () => clearInterval(interval);
  }, [text]);

  return (
    <span>
      {text.slice(0, displayedLength)}
      {displayedLength < text.length && <span className="inline-block w-[2px] h-[14px] ml-[1px] animate-pulse bg-gray-400" />}
    </span>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 py-1">
      {[0, 1, 2].map((i) => (
        <motion.span key={i} className="w-1.5 h-1.5 rounded-full bg-gray-400" animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }} transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2, ease: 'easeInOut' }} />
      ))}
    </div>
  );
}
