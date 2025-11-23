export interface Project {
  id: number;
  nom: string;
  region: number;
  region_nom: string;
  region_code: string;
  description: string;
  date_creation: string;
  etat: ProjectState;
  nombre_equipements: number;
}

export type ProjectState = 'En préparation' | 'En cours' | 'Terminé';

export interface CreateProjectPayload {
  nom: string;
  region: number;
  description?: string;
  etat: ProjectState;
}

export interface ProjectFilters {
  region__code?: string;
  region_id?: number;
  etat?: ProjectState;
}
