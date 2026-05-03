/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { ChatWindow } from './components/ChatWindow';
import { AgentBrain } from './components/AgentBrain';
import { Message, AgentStep, StepType, SandboxFile } from './types';
import { AgentService } from './services/gemini';

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentSteps, setCurrentSteps] = useState<AgentStep[]>([]);
  const [files, setFiles] = useState<SandboxFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const agentService = useMemo(() => new AgentService(), []);

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = { role: 'user', content };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setCurrentSteps([]);

    try {
      const response = await agentService.runAgentLoop(
        [...messages, userMessage], 
        (stepData) => {
          const newStep: AgentStep = {
            id: Math.random().toString(36).substring(2, 9),
            type: stepData.type as StepType,
            content: stepData.content,
            timestamp: Date.now(),
          };
          setCurrentSteps(prev => [...prev, newStep]);
        },
        (filesUpdate) => {
          setFiles(filesUpdate);
        }
      );

      const agentMessage: Message = { 
        role: 'agent', 
        content: response,
        steps: [...currentSteps]
      };
      setMessages(prev => [...prev, agentMessage]);
    } catch (error) {
      console.error(error);
      const errorMessage: Message = { 
        role: 'agent', 
        content: "I encountered a protocol error while processing your request. Sequence terminated prematurely." 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="app-root" className="flex h-screen w-full overflow-hidden bg-[var(--bg)] text-[var(--fg)]">
      <aside className="w-[420px] shrink-0 hidden lg:block overflow-hidden">
        <AgentBrain steps={currentSteps} files={files} />
      </aside>

      <main className="flex-1 min-w-0">
        <ChatWindow 
          messages={messages} 
          onSendMessage={handleSendMessage} 
          isLoading={isLoading} 
        />
      </main>
    </div>
  );
}

