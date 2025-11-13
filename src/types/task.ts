// Task-related type definitions

import type { Priority } from './priority';

export interface TaskBase {
  title: string;
  description?: string | null;
  priority?: Priority;
  is_completed?: boolean;
  due_date?: string | null;
}

export interface TaskCreate extends TaskBase {
  project_id: string;
}

export interface TaskUpdate {
  title?: string;
  description?: string | null;
  priority?: Priority;
  is_completed?: boolean;
  due_date?: string | null;
}

export interface Task extends TaskBase {
  id: string;
  project_id: string;
  priority: Priority;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
}
