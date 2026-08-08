import React, { useState } from 'react';
import { Bot, Send, X, Sparkles, User as UserIcon } from 'lucide-react';
import { aiApi } from '../../../api/ai.api';

export const AIAssistantWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: 'ai' | 'user'; text: string; suggestions?: string[] }>>([
    {
      sender: 'ai',
      text: "Hello! I am your RentFlow AI Assistant. Ask me about equipment availability, security deposit rules, or how late fees are calculated!",
      suggestions: ["How do security deposits work?", "How are late fees calculated?", "Recommended Camera Kit"]
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    setMessages((prev) => [...prev, { sender: 'user', text: query }]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const res = await aiApi.chat(query);
      setMessages((prev) => [
        ...prev,
        { sender: 'ai', text: res.reply, suggestions: res.suggested_actions }
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: 'ai', text: "I'm having trouble connecting right now, but standard deposits are 100% refunded upon on-time return!" }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 text-white font-semibold shadow-2xl glow-indigo hover:scale-105 transition-all"
        >
          <Bot className="w-6 h-6 animate-bounce" />
          <span className="text-sm">Smart AI Assistant</span>
        </button>
      ) : (
        <div className="w-80 sm:w-96 glass-panel rounded-2xl shadow-2xl border border-indigo-500/30 flex flex-col overflow-hidden h-[500px]">
          {/* Header */}
          <div className="p-3.5 bg-gradient-to-r from-indigo-900/90 to-purple-900/90 border-b border-indigo-500/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-indigo-600 text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">RentFlow AI Assistant</h4>
                <p className="text-[10px] text-cyan-300">Instant Rental & Deposit Guidance</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white p-1">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-3 overflow-y-auto space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}>
                <div
                  className={`max-w-[85%] p-3 rounded-xl text-xs leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-indigo-600 text-white rounded-br-none'
                      : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none'
                  }`}
                >
                  {m.text}
                </div>

                {m.suggestions && m.suggestions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {m.suggestions.map((sug, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(sug)}
                        className="text-[10px] bg-indigo-950/60 hover:bg-indigo-900/80 border border-indigo-500/30 text-indigo-300 px-2 py-1 rounded-md transition-colors text-left"
                      >
                        ⚡ {sug}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="text-xs text-slate-400 flex items-center gap-1.5 italic">
                <Bot className="w-3.5 h-3.5 animate-spin text-indigo-400" /> Thinking...
              </div>
            )}
          </div>

          {/* Input Footer */}
          <div className="p-2.5 bg-slate-900/90 border-t border-slate-800 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask AI anything about rentals..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
            <button
              onClick={() => handleSend()}
              className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
