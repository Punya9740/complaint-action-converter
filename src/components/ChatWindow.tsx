
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Message } from '../types';
import { Send, User, Bot, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ChatWindowProps {
  messages: Message[];
  onSendMessage: (content: string) => void;
  isLoading: boolean;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ messages, onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input);
      setInput('');
    }
  };

  return (
    <div id="chat-window" className="flex flex-col h-full bg-[var(--bg)] activity-gradient">
      <div className="px-10 py-6 border-b border-[var(--border)] flex justify-between items-center bg-[var(--bg)]/80 backdrop-blur-md z-10 sticky top-0">
        <div className="flex items-center gap-3">
          <div className="text-xl font-bold tracking-tight">
            AX-9 <span className="font-light opacity-50">TASK_AGENT</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-[12px] uppercase tracking-[0.1em] text-[var(--accent)] font-bold pulse-accent pl-4">
            {isLoading ? 'Executing Loop' : 'System Ready'}
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-10 space-y-12 terminal-scroll">
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex flex-col gap-3 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div className="label-tiny flex items-center gap-2">
                {msg.role === 'user' ? (
                  <>USER_COMMAND <User size={10} /></>
                ) : (
                  <><Bot size={10} /> AGENT_PROTOCOL_01</>
                )}
              </div>
              
              <div className={`p-6 border rounded shadow-2xl max-w-[90%] ${
                msg.role === 'user' 
                  ? 'bg-[var(--surface)] border-[var(--accent)] text-white' 
                  : 'bg-[var(--surface)] border-[var(--border)] text-[#BBB]'
              }`}>
                {msg.role === 'agent' ? (
                  <div className="prose prose-invert prose-sm max-w-none prose-green">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <p className="text-sm font-medium tracking-tight leading-relaxed">{msg.content}</p>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isLoading && (
           <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             className="flex flex-col gap-3"
           >
              <div className="label-tiny flex items-center gap-2 animate-pulse">
                <Bot size={10} /> PROCESSING_SEQUENCE
              </div>
              <div className="p-6 bg-[var(--surface)] border border-[var(--border)] rounded w-64 space-y-3">
                <div className="h-2 w-full bg-white/5 rounded animate-pulse" />
                <div className="h-2 w-2/3 bg-white/5 rounded animate-pulse" />
              </div>
           </motion.div>
        )}
      </div>

      <div className="p-10 bg-transparent border-t border-[var(--border)]">
        <form onSubmit={handleSubmit} className="relative max-w-3xl">
          <div className="label-tiny mb-3">Initialize Command Sequence</div>
          <div className="relative group">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
              placeholder="Inject objective parameters..."
              className="w-full pl-6 pr-14 py-4 bg-[var(--surface)] border border-[var(--border)] text-white rounded focus:outline-none focus:border-[var(--accent)] transition-all disabled:opacity-50 font-mono text-sm uppercase tracking-wider"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 text-[var(--accent)] hover:scale-110 active:scale-95 transition-all disabled:opacity-0"
            >
              <Send size={20} />
            </button>
          </div>
          <div className="flex justify-between items-center mt-4">
             <div className="flex gap-4">
                {['THINK', 'PLAN', 'ACT'].map(label => (
                   <span key={label} className="text-[9px] opacity-20 font-bold tracking-[0.2em] uppercase">{label}</span>
                ))}
             </div>
             <div className="text-[9px] opacity-20 font-bold uppercase tracking-widest italic">
                Direct • Reliable • Focused
             </div>
          </div>
        </form>
      </div>
    </div>
  );
};

