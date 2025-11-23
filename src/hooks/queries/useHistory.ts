import { useEffect, useMemo, useState } from 'react';
import { historyService } from '../../services/historyService';
import type { HistoryEntry, HistoryFilters, HistoryObjectType } from '../../types/history';

export const useHistory = (resourceType?: HistoryObjectType, resourceId?: number) => {
  const [data, setData] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reloadIndex, setReloadIndex] = useState(0);

  const filters = useMemo<HistoryFilters>(() => {
    const result: HistoryFilters = {};
    if (resourceType) result.objet_type = resourceType;
    if (resourceId) result.objet_id = resourceId;
    return result;
  }, [resourceType, resourceId]);

  const filtersKey = useMemo(() => JSON.stringify(filters), [filters]);

  useEffect(() => {
    let ignore = false;
    const controller = new AbortController();

    const fetchHistory = async () => {
      setLoading(true);
      setError(null);
      try {
        const entries = await historyService.list(filters, controller.signal);
        if (!ignore) setData(entries);
      } catch (err) {
        if (!ignore) setError(err instanceof Error ? err.message : 'Failed to load history');
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchHistory();
    return () => {
      ignore = true;
      controller.abort();
    };
  }, [filtersKey, reloadIndex]);

  return {
    data,
    loading,
    error,
    refetch: () => setReloadIndex((prev) => prev + 1),
  };
};
