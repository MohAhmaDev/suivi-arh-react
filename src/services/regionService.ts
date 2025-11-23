import { http } from './httpClient';
import type { Region } from '../types/region';

export const regionService = {
  list: () => http<Region[]>({ url: '/api/regions/' }),
  detail: (id: number) => http<Region>({ url: `/api/regions/${id}/` }),
};
