import { useEffect, useState } from 'react';
import { dossierService } from '../../services/dossierService';
import { courrierService } from '../../services/courrierService';
import type { Dossier } from '../../types/dossier';
import type { Courrier, CourrierDocument } from '../../types/courrier';

export const useDossierDetail = (id: number | undefined) => {
  const [dossier, setDossier] = useState<Dossier | null>(null);
  const [courriers, setCourriers] = useState<Courrier[]>([]);
  const [documents, setDocuments] = useState<CourrierDocument[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reloadIndex, setReloadIndex] = useState(0);

  useEffect(() => {
    if (!id) return undefined;

    let ignore = false;
    const controller = new AbortController();

    const fetchDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const [dossierData, courierData] = await Promise.all([
          dossierService.detail(id, controller.signal),
          courrierService.list({ dossier: id }, controller.signal),
        ]);
        if (!ignore) {
          setDossier(dossierData);
          setCourriers(courierData);
          setDocuments(courierData.flatMap((courrier) => courrier.documents ?? []));
        }
      } catch (err) {
        if (!ignore) setError(err instanceof Error ? err.message : 'Failed to load dossier');
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchDetail();
    return () => {
      ignore = true;
      controller.abort();
    };
  }, [id, reloadIndex]);

  return {
    dossier,
    courriers,
    documents,
    loading,
    error,
    refetch: () => setReloadIndex((prev) => prev + 1),
  };
};
