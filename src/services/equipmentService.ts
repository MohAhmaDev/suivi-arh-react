import { http } from './httpClient';
import type { Equipment, CreateEquipmentPayload, EquipmentFilters, Specification } from '../types/equipment';
import type { HistoryEntry } from '../types/history';

export type UpdateEquipmentPayload = Partial<CreateEquipmentPayload>;

const buildEquipmentQuery = (filters?: EquipmentFilters) => {
  const params = new URLSearchParams();
  if (filters?.statut) params.append('statut', filters.statut);
  if (filters?.etat) params.append('etat', filters.etat);
  if (filters?.projet) params.append('projet', String(filters.projet));
  return params.toString();
};

export const equipmentService = {
  list: (filters?: EquipmentFilters, signal?: AbortSignal) => {
    const query = buildEquipmentQuery(filters);
    return http<Equipment[]>({ url: `/api/equipements/${query ? `?${query}` : ''}`, signal });
  },

  detail: (id: number, signal?: AbortSignal) =>
    http<Equipment>({ url: `/api/equipements/${id}/`, signal }),

  create: (payload: CreateEquipmentPayload) =>
    http<Equipment>({ url: '/api/equipements/', method: 'POST', body: payload }),

  update: (id: number, payload: UpdateEquipmentPayload) =>
    http<Equipment>({ url: `/api/equipements/${id}/`, method: 'PUT', body: payload }),

  remove: (id: number) => http<void>({ url: `/api/equipements/${id}/`, method: 'DELETE' }),

  validate: (id: number) =>
    http<{ id: number; statut: string }>({ url: `/api/equipements/${id}/valider/`, method: 'POST' }),

  reject: (id: number) =>
    http<{ id: number; statut: string }>({ url: `/api/equipements/${id}/refuser/`, method: 'POST' }),

  getSpecifications: (id: number, signal?: AbortSignal) =>
    http<Specification[]>({ url: `/api/equipements/${id}/features/`, signal }),

  getFeatures: (id: number, signal?: AbortSignal) =>
    http<Specification[]>({ url: `/api/equipements/${id}/features/`, signal }),

  getHistory: (id: number, signal?: AbortSignal) => {
    const params = new URLSearchParams();
    params.append('objet_type', 'Equipment');
    params.append('objet_id', String(id));
    const query = params.toString();
    return http<HistoryEntry[]>({ url: `/api/historiques/${query ? `?${query}` : ''}`, signal });
  },
};
