export enum PipelineStage {
  NEW = 'New',
  CONTACTED = 'Contacted',
  QUALIFIED = 'Qualified',
  PROPOSAL = 'Proposal',
  WON = 'Won',
  LOST = 'Lost'
}

export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone?: string;
  status: PipelineStage;
  value: number;
  owner: string;
  source: string;
  created_at: string;
  avatar?: string;
}

export interface KPI {
  label: string;
  value: string;
  trend: number; // percentage
  trendLabel: string;
}

export type ViewState = 'DASHBOARD' | 'PIPELINE' | 'LEADS' | 'TASKS' | 'SETTINGS';

export enum TaskStatus {
  TODO = 'To do',
  IN_PROGRESS = 'In progress',
  WAITING = 'Waiting',
  DONE = 'Done'
}

export enum TaskPriority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High'
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  due_date?: string; // ISO string
  owner_email?: string;
  related_lead_id?: string;
  created_at: string;
  updated_at: string;
  completed_at?: string;
}
