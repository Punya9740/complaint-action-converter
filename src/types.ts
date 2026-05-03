
export enum StepType {
  THINK = 'THINK',
  PLAN = 'PLAN',
  ACT = 'ACT',
  OBSERVE = 'OBSERVE',
  ANSWER = 'ANSWER'
}

export interface AgentStep {
  id: string;
  type: StepType;
  content: string;
  timestamp: number;
}

export interface SandboxFile {
  path: string;
  content: string;
  updatedAt: number;
}

export interface Message {
  role: 'user' | 'agent';
  content: string;
  steps?: AgentStep[];
}
