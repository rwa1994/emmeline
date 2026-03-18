export type UserRole = 'her' | 'partner';

export type CyclePhase = 'menstrual' | 'follicular' | 'ovulatory' | 'luteal';

export interface Profile {
  id: string;
  name: string;
  role: UserRole;
  cycle_length: number;
  period_length: number;
  last_period_start: string;
  created_at: string;
}

export type FlowLevel = 'none' | 'spotting' | 'light' | 'medium' | 'heavy';

export interface DailyLog {
  id: string;
  user_id: string;
  log_date: string;
  flow: FlowLevel;
  physical_symptoms: string[];
  emotional_symptoms: string[];
  energy: number;
  notes: string;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

export interface PhaseInfo {
  phase: CyclePhase;
  name: string;
  dayRange: string;
  color: string;
  bgColor: string;
  description: string;
  nutrition: string[];
  exercise: string[];
  avoid: string[];
  mentalHealth: string[];
  recipes: { name: string; description: string; ingredients?: string[]; steps?: string[] }[];
}
