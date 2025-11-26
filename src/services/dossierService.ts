import { http } from './httpClient';
import type {
  CreateDossierPayload,
  Dossier,
  DossierFilters,
  DossierValidationPayload,
} from '../types/dossier';
import type { Courrier } from '../types/courrier';
import type { DossierStats } from '../types/stats';

const buildDossierQuery = (filters?: DossierFilters) => {
  const params = new URLSearchParams();
  if (filters?.statut) params.append('statut', filters.statut);
  if (filters?.type_dossier) params.append('type_dossier', filters.type_dossier);
  if (filters?.equipement) params.append('equipement', String(filters.equipement));
  return params.toString();
};

export const dossierService = {
  list: (filters?: DossierFilters, signal?: AbortSignal) => {
    const query = buildDossierQuery(filters);
    return http<Dossier[]>({ url: `/api/dossiers/${query ? `?${query}` : ''}`, signal });
  },

  detail: (id: number, signal?: AbortSignal) =>
    http<Dossier>({ url: `/api/dossiers/${id}/`, signal }),

  create: (payload: CreateDossierPayload) =>
    http<Dossier>({ url: '/api/dossiers/', method: 'POST', body: payload }),

  validate: (id: number, payload?: DossierValidationPayload) =>
    http<{ id: number; statut: string }>({
      url: `/api/dossiers/${id}/valider/`,
      method: 'POST',
      body: payload,
    }),

  reject: (id: number, payload: DossierValidationPayload) =>
    http<{ id: number; statut: string }>({
      url: `/api/dossiers/${id}/refuser/`,
      method: 'POST',
      body: payload,
    }),

  getCourriers: (id: number) =>
    http<Courrier[]>({ url: `/api/dossiers/${id}/courriers/` }),

  stats: (signal?: AbortSignal) =>
    http<DossierStats>({ url: '/api/dossiers/stats/', signal }),
};
