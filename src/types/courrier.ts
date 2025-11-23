export type CourrierStatus = 'Envoyé' | 'Reçu' | 'Lu' | 'Traité';

export interface CourrierDocument {
  id: number;
  courrier: number;
  courrier_info: {
    id: number;
    reference: string;
    objet: string;
  };
  fichier: string;
  nom_fichier: string;
  type_document: string;
  taille: number;
  description?: string;
  date_ajout: string;
  ajoute_par: number;
  ajoute_par_username: string;
  url_fichier: string;
}

export interface Courrier {
  id: number;
  dossier: number;
  dossier_info: {
    id: number;
    type: string;
    equipement: string;
  };
  expediteur: number;
  expediteur_nom: string;
  destinataire: number;
  destinataire_nom: string;
  objet?: string;
  reference?: string;
  commentaire?: string;
  date_envoi?: string | null;
  date_reception?: string | null;
  statut: CourrierStatus;
  documents: CourrierDocument[];
  nombre_documents: number;
}

export interface CreateCourrierPayload {
  dossier: number;
  expediteur: number;
  destinataire: number;
  objet?: string;
  reference?: string;
  commentaire?: string;
  statut?: CourrierStatus;
}

export interface CourrierFilters {
  statut?: CourrierStatus;
  expediteur?: number;
  destinataire?: number;
  dossier?: number;
}
