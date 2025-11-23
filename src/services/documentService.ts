import { http } from './httpClient';
import type { DocumentFilters, DocumentMetadata, UploadDocumentPayload } from '../types/document';

const buildDocumentQuery = (filters?: DocumentFilters) => {
  const params = new URLSearchParams();
  if (filters?.courrier) params.append('courrier', String(filters.courrier));
  if (filters?.type_document) params.append('type_document', filters.type_document);
  return params.toString();
};

export const documentService = {
  list: (filters?: DocumentFilters, signal?: AbortSignal) => {
    const query = buildDocumentQuery(filters);
    return http<DocumentMetadata[]>({ url: `/api/documents/${query ? `?${query}` : ''}`, signal });
  },

  detail: (id: number, signal?: AbortSignal) =>
    http<DocumentMetadata>({ url: `/api/documents/${id}/`, signal }),

  upload: (payload: UploadDocumentPayload) => {
    const formData = new FormData();
    formData.append('courrier', String(payload.courrier));
    formData.append('fichier', payload.fichier);
    if (payload.description) formData.append('description', payload.description);

    return http<DocumentMetadata>({ url: '/api/documents/', method: 'POST', body: formData });
  },
};
