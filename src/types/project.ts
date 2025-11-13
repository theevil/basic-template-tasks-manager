// Project-related type definitions

export interface ProjectBase {
  name: string;
  description?: string | null;
}

export interface ProjectCreate extends ProjectBase {}

export interface ProjectUpdate {
  name?: string;
  description?: string | null;
}

export interface Project extends ProjectBase {
  id: string;
  created_at: string;
  updated_at: string;
}
