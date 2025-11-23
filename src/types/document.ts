export interface DocumentMetadata {
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

export interface UploadDocumentPayload {
  courrier: number;
  fichier: File;
  description?: string;
}

export interface DocumentFilters {
  courrier?: number;
  type_document?: string;
}
