
import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AgentStep, SandboxFile } from '../types';
import { FileText, Database } from 'lucide-react';

interface AgentBrainProps {
  steps: AgentStep[];
  files: SandboxFile[];
}

const STEPS = ['THINK', 'PLAN', 'ACT', 'OBSERVE'];

export const AgentBrain: React.FC<AgentBrainProps> = ({ steps, files }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastStep = steps[steps.length - 1]?.type || 'IDLE';

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [steps]);

  return (
    <div id="agent-brain" className="flex flex-col h-full border-r border-[var(--border)] bg-[var(--bg)] p-10 justify-between overflow-hidden">
      <div className="space-y-10 overflow-hidden flex flex-col">
        <div>
          <div className="label-tiny mb-2">Current State</div>
          <div className="huge-text">
            {lastStep === 'IDLE' ? 'READY' : lastStep}
            <br />
            <span className="text-[var(--accent)]">{lastStep === 'IDLE' ? 'WAITING' : 'EXECUTING'}</span>
          </div>
        </div>

        <ul className="space-y-0 shrink-0">
          {STEPS.map((s, i) => {
            const isActive = lastStep === s;
            return (
              <li 
                key={s} 
                className={`flex justify-between py-4 border-b border-[var(--border)] transition-opacity duration-500 ${isActive ? 'opacity-100 border-[var(--accent)]' : 'opacity-20'}`}
              >
                <span className="font-mono text-xs font-bold">0{i + 1}</span>
                <span className="font-bold tracking-widest text-sm uppercase">{s}</span>
              </li>
            );
          })}
        </ul>

        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="label-tiny mb-3 flex items-center gap-2">
            <Database size={10} /> Virtual Storage v4
          </div>
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded p-4 flex-1 overflow-y-auto technical-grid">
            {files.length === 0 ? (
              <div className="font-mono text-[10px] opacity-20 uppercase text-center mt-4 tracking-tighter">No I/O activity detected</div>
            ) : (
              <div className="space-y-3">
                {files.map(file => (
                  <div key={file.path} className="flex items-start gap-2 border-b border-white/5 pb-2 last:border-0">
                    <FileText size={12} className="text-[var(--accent)] mt-0.5 shrink-0" />
                    <div className="min-w-0">
                      <div className="font-mono text-[11px] font-bold text-white truncate">{file.path}</div>
                      <div className="font-mono text-[10px] opacity-40 text-white/60 line-clamp-1">{file.content.substring(0, 30)}...</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-6 pt-10">
        <div>
          <div className="label-tiny mb-2">Internal Trace</div>
          <div ref={scrollRef} className="h-32 overflow-y-auto font-mono text-[11px] leading-relaxed text-[#888] terminal-scroll space-y-1">
            <AnimatePresence initial={false}>
              {steps.map((step) => (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <span className={step.type === 'ACT' ? 'text-[var(--accent)]' : 'text-[#444]'}>
                    [{new Date(step.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}]
                  </span>{' '}
                  <span className="uppercase text-[var(--accent)]/50">{step.type}</span>: {step.content.substring(0, 40)}...
                </motion.div>
              ))}
            </AnimatePresence>
            <div className="text-[var(--accent)] animate-pulse">_</div>
          </div>
        </div>

        <div className="flex justify-between items-end border-t border-[var(--border)] pt-6">
          <div>
            <div className="label-tiny">Agent Integrity</div>
            <div className="font-mono text-[10px] space-x-3 mt-1">
              <span>SYNC: OK</span>
              <span>TOKEN: SHA-256</span>
            </div>
          </div>
          <div className="text-right">
             <div className="label-tiny">Protocol</div>
             <div className="font-mono text-[10px] mt-1 uppercase">AX-09.DEPLOYED</div>
          </div>
        </div>
      </div>
    </div>
  );
};
