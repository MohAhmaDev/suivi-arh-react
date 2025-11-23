import { useEffect, useState } from 'react';
import { equipmentService } from '../../services/equipmentService';
import { dossierService } from '../../services/dossierService';
import type { Equipment, Specification } from '../../types/equipment';
import type { Dossier } from '../../types/dossier';
import type { HistoryEntry } from '../../types/history';

export const useEquipmentDetail = (id: number | undefined) => {
  const [equipment, setEquipment] = useState<Equipment | null>(null);
  const [specifications, setSpecifications] = useState<Specification[]>([]);
  const [dossiers, setDossiers] = useState<Dossier[]>([]);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
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
        const [equipmentData, specsData, dossierData, historyData] = await Promise.all([
          equipmentService.detail(id, controller.signal),
          equipmentService.getSpecifications(id, controller.signal),
          dossierService.list({ equipement: id }, controller.signal),
          equipmentService.getHistory(id, controller.signal),
        ]);
        if (!ignore) {
          setEquipment(equipmentData);
          setSpecifications(specsData);
          setDossiers(dossierData);
          setHistory(historyData);
        }
      } catch (err) {
        if (!ignore) setError(err instanceof Error ? err.message : 'Failed to load equipment');
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
    equipment,
    specifications,
    dossiers,
    history,
    loading,
    error,
    refetch: () => setReloadIndex((prev) => prev + 1),
  };
};
