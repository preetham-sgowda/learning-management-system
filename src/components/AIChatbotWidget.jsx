import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';

const AIChatbotWidget = () => {
  const { user } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: `Hi ${user.name}! I'm your Groq AI Assistant on SkillForge. Ask me anything about Data Structures, System Design, or Resume ATS prep.`,
      time: 'Just now'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  const predefinedPrompts = [
    'Explain Time Complexity of QuickSort',
    'How to design a Rate Limiter?',
    'Tips to improve ATS Resume Score'
  ];

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSendMessage = (textToSend) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    // Simulate Groq AI response
    setTimeout(() => {
      let aiText = "That's a great question! For high-scale technical interviews, focus on analyzing time/space trade-offs and handling edge cases in test suites.";
      
      if (query.toLowerCase().includes('quicksort') || query.toLowerCase().includes('complexity')) {
        aiText = "QuickSort has average time complexity O(N log N) and worst-case O(N²) when pivot selection is poor. Using randomized pivot selection guarantees expected O(N log N).";
      } else if (query.toLowerCase().includes('rate limiter') || query.toLowerCase().includes('system design')) {
        aiText = "Rate Limiters can be implemented using: 1. Token Bucket algorithm, 2. Leaky Bucket algorithm, 3. Sliding Window Logs. Redis is ideal for distributed counter caching.";
      } else if (query.toLowerCase().includes('ats') || query.toLowerCase().includes('resume')) {
        aiText = "To boost ATS Match Score: 1. Use standard section headers, 2. Match exact technical keywords (e.g. React.js, B-Tree, REST), 3. Quantify project impact with metrics.";
      }

      const aiMsg = {
        id: Date.now() + 1,
        sender: 'ai',
        text: aiText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 800);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-full bg-[#0B0F17] hover:bg-slate-900 text-white shadow-2xl border border-[#810B38] group transition-all hover:scale-105"
      >
        <div className="w-8 h-8 rounded-full bg-[#810B38] flex items-center justify-center text-white shadow-md">
          <span className="material-symbols-outlined text-[18px]">smart_toy</span>
        </div>
        <span className="font-display text-xs font-bold text-white tracking-wide">Ask Groq AI</span>
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-80 sm:w-96 bg-[#0B0F17] text-white rounded-3xl shadow-2xl border border-white/10 flex flex-col overflow-hidden z-50 animate-fade-in-up">
      {/* Header */}
      <div className="p-4 border-b border-white/10 bg-white/5 flex justify-between items-center backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#810B38] flex items-center justify-center text-white">
            <span className="material-symbols-outlined text-[18px]">smart_toy</span>
          </div>
          <div>
            <h4 className="font-display text-xs font-bold text-white">SkillForge AI Assistant</h4>
            <p className="text-[10px] text-cyan-400 font-mono">Groq Llama-3 Engine Active</p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="p-4 h-72 overflow-y-auto space-y-3 bg-[#0B0F17]/90 text-xs">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] p-3 rounded-2xl leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-[#810B38] text-white rounded-br-none'
                  : 'bg-white/10 text-slate-200 border border-white/10 rounded-bl-none'
              }`}
            >
              <p>{msg.text}</p>
              <span className="text-[9px] opacity-60 mt-1 block text-right font-mono">{msg.time}</span>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono">
            <span className="material-symbols-outlined text-[14px] animate-spin">sync</span>
            <span>Groq AI is processing...</span>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Quick Prompt Pills */}
      <div className="px-3 py-2 bg-slate-950 border-t border-white/5 flex gap-1.5 overflow-x-auto">
        {predefinedPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(prompt)}
            className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 text-white/80 text-[10px] whitespace-nowrap border border-white/10 transition-colors"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Field */}
      <div className="p-3 bg-[#0B0F17] border-t border-white/10">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="relative"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask a technical question..."
            className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-4 pr-10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-[#810B38]"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-rose-400 hover:text-rose-300 p-1"
          >
            <span className="material-symbols-outlined text-[18px]">send</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default AIChatbotWidget;
