import type { HistoryEntry } from './history';
import type { DossierStatus, DossierType } from './dossier';
import type { EquipmentState, EquipmentStatus } from './equipment';
import type { ProjectState } from './project';
import type { CourrierStatus } from './courrier';

export type StatMap = Record<string, number>;

export interface DossierStats {
  total: number;
  par_statut: StatMap & Partial<Record<DossierStatus, number>>;
  par_type: StatMap & Partial<Record<DossierType, number>>;
}

export interface EquipmentStats {
  total: number;
  par_statut: StatMap & Partial<Record<EquipmentStatus, number>>;
  par_etat: StatMap & Partial<Record<EquipmentState, number>>;
}

export interface ProjectStats {
  total: number;
  par_etat: StatMap & Partial<Record<ProjectState, number>>;
}

export interface CourrierStats {
  total: number;
  par_statut: StatMap & Partial<Record<CourrierStatus, number>>;
}

export interface DashboardStats {
  projets: ProjectStats;
  equipements: EquipmentStats;
  dossiers: DossierStats;
  courriers: CourrierStats;
}

export type RecentActivity = HistoryEntry;
