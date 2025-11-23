import { http } from './httpClient';
import type { Courrier, CourrierFilters, CreateCourrierPayload } from '../types/courrier';
import type { DocumentMetadata } from '../types/document';

const buildCourrierQuery = (filters?: CourrierFilters) => {
  const params = new URLSearchParams();
  if (filters?.statut) params.append('statut', filters.statut);
  if (filters?.expediteur) params.append('expediteur', String(filters.expediteur));
  if (filters?.destinataire) params.append('destinataire', String(filters.destinataire));
  if (filters?.dossier) params.append('dossier', String(filters.dossier));
  return params.toString();
};

export const courrierService = {
  list: (filters?: CourrierFilters, signal?: AbortSignal) => {
    const query = buildCourrierQuery(filters);
    return http<Courrier[]>({ url: `/api/courriers/${query ? `?${query}` : ''}`, signal });
  },

  detail: (id: number, signal?: AbortSignal) =>
    http<Courrier>({ url: `/api/courriers/${id}/`, signal }),

  create: (payload: CreateCourrierPayload) =>
    http<Courrier>({ url: '/api/courriers/', method: 'POST', body: payload }),

  getDocuments: (id: number) =>
    http<DocumentMetadata[]>({ url: `/api/courriers/${id}/documents/` }),
};
