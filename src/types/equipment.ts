export interface Equipment {
  id: number;
  projet: number;
  projet_nom: string;
  nom: string;
  localisation: string;
  statut: EquipmentStatus;
  etat: EquipmentState;
  reference: string;
  numero_serie: string;
  date_installation: string;
  specifications: Specification[];
  nombre_dossiers: number;
}

export type EquipmentStatus = 'En attente' | 'Validé' | 'Rejeté' | 'En cours';
export type EquipmentState = 'En service' | 'En panne' | 'Hors service';

export interface Specification {
  id: number;
  equipement: number;
  categorie: number;
  categorie_nom: string;
  categorie_unite: string;
  valeur: string;
}

export interface CreateEquipmentPayload {
  projet: number;
  nom: string;
  localisation?: string;
  statut: EquipmentStatus;
  etat?: EquipmentState;
  reference?: string;
  numero_serie?: string;
  date_installation?: string;
}

export interface EquipmentFilters {
  statut?: EquipmentStatus;
  etat?: EquipmentState;
  projet?: number;
}
