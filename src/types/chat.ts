export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface DiagnosisSummary {
  symptoms: string[];
  possibleConditions: string[];
  recommendations: string[];
  medications: string[];
  followUpNeeded: boolean;
  urgencyLevel: 'low' | 'medium' | 'high';
}

export interface ChatSession {
  id: string;
  messages: Message[];
  diagnosisSummary?: DiagnosisSummary;
  createdAt: Date;
  updatedAt: Date;
}