import { useCallback, useEffect, useMemo, useState } from 'react';
import { dossierService } from '../../services/dossierService';
import type { Dossier, DossierFilters } from '../../types/dossier';

const serializeFilters = (filters: DossierFilters) => JSON.stringify(filters ?? {});

type FiltersUpdater = DossierFilters | ((prev: DossierFilters) => DossierFilters);

export const useDossiers = (initialFilters: DossierFilters = {}) => {
  const [data, setData] = useState<Dossier[]>([]);
  const [filters, setFiltersState] = useState<DossierFilters>(initialFilters);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reloadIndex, setReloadIndex] = useState(0);

  const filtersKey = useMemo(() => serializeFilters(filters), [filters]);

  const setFilters = useCallback((updater: FiltersUpdater) => {
    setFiltersState((prev) =>
      typeof updater === 'function' ? (updater as (prev: DossierFilters) => DossierFilters)(prev) : updater,
    );
  }, []);

  useEffect(() => {
    let ignore = false;
    const controller = new AbortController();

    const fetchDossiers = async () => {
      setLoading(true);
      setError(null);
      try {
        const dossiers = await dossierService.list(filters, controller.signal);
        if (!ignore) setData(dossiers);
      } catch (err) {
        if (!ignore) setError(err instanceof Error ? err.message : 'Failed to load dossiers');
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchDossiers();
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
