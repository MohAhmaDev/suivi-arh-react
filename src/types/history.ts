export type HistoryObjectType = 'Dossier' | 'DocumentCourrier' | 'Equipment' | 'Project' | string;

export interface HistoryEntry {
  id: number;
  user: number;
  user_username: string;
  action: string;
  date_action: string;
  objet_type: HistoryObjectType;
  objet_id: number;
}

export interface HistoryFilters {
  objet_type?: HistoryObjectType;
  objet_id?: number;
  limit?: number;
}
