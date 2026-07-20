import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X, Send, Loader2, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';
import { generateAIPLAN } from '../services/healthService';

export default function ChatBot({ 
  isOpen, 
  setIsOpen, 
  themeColor 
}: { 
  isOpen: boolean, 
  setIsOpen: (open: boolean) => void,
  themeColor: 'teal' | 'purple' | 'rose' | 'orange'
}) {
  const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string}[]>([
    { role: 'ai', text: 'Hello! I am your AI Health Assistant. How can I help you with your health or fitness goals today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userText = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setIsTyping(true);

    const response = await generateAIPLAN(`
      You are a specialized health and fitness AI chatbot named "AI Health Pro Assistant".
      Answer the user's health related question concisely and professionally.
      User question: "${userText}"
      Keep it brief and medically cautious. Always suggest consulting a professional for critical issues.
    `);

    setMessages(prev => [...prev, { role: 'ai', text: response || "I'm sorry, I'm having trouble connecting right now." }]);
    setIsTyping(false);
  };

  const accentColors = {
    teal: 'bg-teal-600',
    purple: 'bg-purple-600',
    rose: 'bg-rose-600',
    orange: 'bg-orange-600'
  };

  return (
    <div className="fixed bottom-6 left-6 z-[60]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="absolute bottom-16 left-0 w-[350px] max-w-[90vw] h-[500px] bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden"
          >
            <div className={cn("p-6 text-white flex items-center justify-between", accentColors[themeColor])}>
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5" />
                <h3 className="font-bold">Health Buddy</h3>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div ref={scrollRef} className="flex-grow p-4 overflow-y-auto space-y-4 no-scrollbar">
              {messages.map((m, i) => (
                <div key={i} className={cn(
                  "flex",
                  m.role === 'user' ? "justify-end" : "justify-start"
                )}>
                  <div className={cn(
                    "max-w-[80%] p-3 text-sm leading-relaxed whitespace-pre-wrap",
                    m.role === 'user' 
                      ? cn("text-white rounded-2xl rounded-tr-none", accentColors[themeColor]) 
                      : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-2xl rounded-tl-none"
                  )}>
                    {m.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-2xl flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
                    <span className="text-xs text-slate-400">Processing...</span>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex gap-2">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask health/gym tip..."
                className="flex-grow bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500/20"
              />
              <button 
                onClick={handleSend}
                disabled={isTyping}
                className={cn("p-2 text-white rounded-xl transition-transform hover:scale-110", accentColors[themeColor])}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-14 h-14 rounded-full flex items-center justify-center text-white shadow-xl shadow-teal-500/20",
          accentColors[themeColor]
        )}
      >
        <MessageCircle className="w-6 h-6" />
      </motion.button>
    </div>
  );
}
