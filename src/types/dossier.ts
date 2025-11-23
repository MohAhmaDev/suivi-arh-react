import type { Status } from './common';

export type DossierStatus =
  | 'En cours'
  | 'Validé'
  | 'Concluant'
  | 'Non concluant'
  | 'Refusé';

export type DossierType =
  | 'Préliminaire'
  | 'Essai usine'
  | 'Essai site'
  | 'Procédure essai'
  | 'HSE'
  | 'Final';

export interface Dossier {
  id: number;
  equipement: number;
  equipement_nom: string;
  equipement_projet: string;
  type_dossier: DossierType;
  statut: DossierStatus;
  commentaire?: string;
  cree_par: number;
  cree_par_username: string;
  valide_par?: number | null;
  valide_par_username?: string | null;
  date_creation: string;
  date_validation?: string | null;
  courriers?: number[];
  nombre_courriers: number;
}

export interface CreateDossierPayload {
  equipement: number;
  type_dossier: DossierType;
  statut: DossierStatus;
  commentaire?: string;
}

export interface DossierFilters {
  statut?: DossierStatus;
  type_dossier?: DossierType;
  equipement?: number;
}

export interface DossierValidationPayload {
  commentaire?: string;
}

export type DossierStatusColorMap = Record<DossierStatus, Status>;
