import { useCallback, useEffect, useMemo, useState } from 'react';
import { courrierService } from '../../services/courrierService';
import type { Courrier, CourrierFilters } from '../../types/courrier';

const serializeFilters = (filters: CourrierFilters) => JSON.stringify(filters ?? {});

type FiltersUpdater = CourrierFilters | ((prev: CourrierFilters) => CourrierFilters);

export const useCourriers = (initialFilters: CourrierFilters = {}) => {
  const [data, setData] = useState<Courrier[]>([]);
  const [filters, setFiltersState] = useState<CourrierFilters>(initialFilters);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reloadIndex, setReloadIndex] = useState(0);

  const filtersKey = useMemo(() => serializeFilters(filters), [filters]);

  const setFilters = useCallback((updater: FiltersUpdater) => {
    setFiltersState((prev) =>
      typeof updater === 'function' ? (updater as (prev: CourrierFilters) => CourrierFilters)(prev) : updater,
    );
  }, []);

  useEffect(() => {
    let ignore = false;
    const controller = new AbortController();

    const fetchCourriers = async () => {
      setLoading(true);
      setError(null);
      try {
        const courriers = await courrierService.list(filters, controller.signal);
        if (!ignore) setData(courriers);
      } catch (err) {
        if (!ignore) setError(err instanceof Error ? err.message : 'Failed to load courriers');
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchCourriers();
    return () => {
      ignore = true;
      controller.abort();
    };
  }, [filtersKey, reloadIndex]);

  return {
    data,
    filters,
    setFilters,
    loading,
    error,
    refetch: () => setReloadIndex((prev) => prev + 1),
  };
};
