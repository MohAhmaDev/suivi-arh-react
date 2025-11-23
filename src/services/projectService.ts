import { http } from './httpClient';
import type { Project, CreateProjectPayload, ProjectFilters } from '../types/project';
import type { Equipment } from '../types/equipment';

export const projectService = {
  list: (filters?: ProjectFilters) => {
    const params = new URLSearchParams();
    if (filters?.region__code) params.append('region__code', filters.region__code);
    if (filters?.region_id) params.append('region_id', String(filters.region_id));
    if (filters?.etat) params.append('etat', filters.etat);
    const query = params.toString();
    return http<Project[]>({ url: `/api/projets/${query ? `?${query}` : ''}` });
  },

  detail: (id: number) => http<Project>({ url: `/api/projets/${id}/` }),

  create: (payload: CreateProjectPayload) =>
    http<Project>({ url: '/api/projets/', method: 'POST', body: payload }),

  getEquipment: (id: number) =>
    http<Equipment[]>({ url: `/api/projets/${id}/equipements/` }),
};
