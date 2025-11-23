import { http } from './httpClient';
import type { HistoryEntry, HistoryFilters } from '../types/history';

const buildHistoryQuery = (filters?: HistoryFilters) => {
  const params = new URLSearchParams();
  if (filters?.objet_type) params.append('objet_type', filters.objet_type);
  if (filters?.objet_id) params.append('objet_id', String(filters.objet_id));
  return params.toString();
};

export const historyService = {
  list: (filters?: HistoryFilters, signal?: AbortSignal) => {
    const query = buildHistoryQuery(filters);
    return http<HistoryEntry[]>({ url: `/api/historiques/${query ? `?${query}` : ''}`, signal });
  },

  detail: (id: number, signal?: AbortSignal) =>
    http<HistoryEntry>({ url: `/api/historiques/${id}/`, signal }),
};
