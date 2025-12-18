
import React, { useState, useRef, useEffect } from 'react';
import { askLabAssistant } from '../services/gemini';

const LabAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; text: string }[]>([
    { role: 'assistant', text: "Systems online. How can I assist with your inquiry today?" }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    const response = await askLabAssistant(userMsg);
    setMessages(prev => [...prev, { role: 'assistant', text: response }]);
    setIsTyping(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] font-display">
      {isOpen ? (
        <div className="w-80 sm:w-96 h-[450px] bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-800 rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="p-4 bg-primary text-white flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-sm animate-pulse">monitoring</span>
              <span className="font-mono text-xs font-bold uppercase tracking-widest">Lab Assistant v2.1</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 rounded p-1">
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>
          <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-4 no-scrollbar">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-3 py-2 rounded-lg text-sm ${
                  m.role === 'user' 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-100 dark:bg-gray-800 text-slate-800 dark:text-gray-200'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-lg flex gap-1">
                  <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            )}
          </div>
          <div className="p-4 border-t border-gray-100 dark:border-gray-800">
            <div className="flex gap-2">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Query system..."
                className="flex-1 bg-gray-50 dark:bg-gray-900 border-none rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary dark:text-white"
              />
              <button 
                onClick={handleSend}
                className="bg-primary text-white p-2 rounded-lg hover:bg-primary/90 transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">send</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-primary text-white rounded-full shadow-lg shadow-primary/30 flex items-center justify-center hover:scale-105 transition-transform group"
        >
          <span className="material-symbols-outlined group-hover:rotate-12 transition-transform">bolt</span>
        </button>
      )}
    </div>
  );
};

export default LabAssistant;
