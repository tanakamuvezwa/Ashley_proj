import React, { useState } from 'react';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  ChevronRight, 
  HelpCircle, 
  Zap, 
  ShieldCheck,
  Building2
} from 'lucide-react';

interface ChatMessage {
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  quickActions?: { label: string; action: string }[];
}

export const AiAdvisorWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [inputQuery, setInputQuery] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'ai',
      text: 'Mhoro / Salibonani! I am Apex AI — your intelligent SADC financial advisor. How can I help you get capital or invest today?',
      timestamp: 'Just now',
      quickActions: [
        { label: 'How to get a 7.2% APR loan?', action: 'loan-rates' },
        { label: 'ZWG / USD FX details', action: 'fx-info' },
        { label: 'Which institutions are bidding?', action: 'banks-info' }
      ]
    }
  ]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputQuery('');

    // Push placeholder thinking message
    const typingMsg: ChatMessage = {
      sender: 'ai',
      text: 'Thinking...',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages((prev) => [...prev, typingMsg]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });
      const data = await response.json();
      
      setMessages((prev) => {
        const filtered = prev.slice(0, prev.length - 1);
        return [...filtered, {
          sender: 'ai',
          text: data.text || 'I encountered an issue processing your query.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }];
      });
    } catch (err) {
      setMessages((prev) => {
        const filtered = prev.slice(0, prev.length - 1);
        return [...filtered, {
          sender: 'ai',
          text: 'Unable to connect to AI server. Please verify connections.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }];
      });
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      
      {/* Trigger Button when closed */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="relative group p-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-600 to-amber-500 text-slate-950 font-bold shadow-2xl shadow-emerald-900/50 hover:scale-105 transition-all duration-300 flex items-center space-x-2.5 cursor-pointer border border-white/20 ring-4 ring-emerald-500/20"
        >
          <Bot className="w-6 h-6 fill-slate-950 animate-bounce" />
          <span className="text-xs font-black uppercase tracking-wider hidden sm:inline">Ask Apex AI</span>
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-500"></span>
          </span>
        </button>
      )}

      {/* Floating Chat Modal Panel */}
      {isOpen && (
        <div className="glass-card w-[360px] sm:w-[400px] h-[520px] rounded-3xl border-emerald-500/40 shadow-2xl flex flex-col overflow-hidden animate-fade-in relative bg-[#0B0F17]/95">
          
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white flex items-center space-x-1">
                  <span>Apex AI Assistant</span>
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                </h4>
                <p className="text-[10px] text-emerald-400 font-medium">Online • 28 SADC Banks Connected</p>
              </div>
            </div>

            <button 
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3.5 rounded-2xl leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-emerald-600 text-white rounded-br-none'
                      : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none shadow-md'
                  }`}
                >
                  <p>{msg.text}</p>

                  {/* Quick actions chips */}
                  {msg.quickActions && (
                    <div className="mt-3 space-y-1.5 pt-2 border-t border-slate-800">
                      {msg.quickActions.map((qa, i) => (
                        <button
                          key={i}
                          onClick={() => handleSend(qa.label)}
                          className="w-full text-left p-1.5 px-2.5 rounded-lg bg-slate-950/80 hover:bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold border border-slate-800 flex items-center justify-between transition"
                        >
                          <span>{qa.label}</span>
                          <ChevronRight className="w-3 h-3 text-emerald-400" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <span className="text-[9px] text-slate-500 mt-1 px-1">{msg.timestamp}</span>
              </div>
            ))}
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-slate-950 border-t border-slate-800 flex items-center space-x-2"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask about loans, rates, FX, or pitching..."
              className="flex-1 glass-input px-3.5 py-2.5 rounded-xl text-xs focus:ring-1 focus:ring-emerald-500"
            />
            <button
              type="submit"
              className="p-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition shadow-md shrink-0 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}

    </div>
  );
};
