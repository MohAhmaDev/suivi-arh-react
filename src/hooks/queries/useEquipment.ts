import { useCallback, useEffect, useMemo, useState } from 'react';
import { equipmentService } from '../../services/equipmentService';
import type { Equipment, EquipmentFilters } from '../../types/equipment';

const serializeFilters = (filters: EquipmentFilters) => JSON.stringify(filters ?? {});

type FiltersUpdater = EquipmentFilters | ((prev: EquipmentFilters) => EquipmentFilters);

export const useEquipment = (initialFilters: EquipmentFilters = {}) => {
  const [data, setData] = useState<Equipment[]>([]);
  const [filters, setFiltersState] = useState<EquipmentFilters>(initialFilters);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reloadIndex, setReloadIndex] = useState(0);

  const filtersKey = useMemo(() => serializeFilters(filters), [filters]);

  const setFilters = useCallback((updater: FiltersUpdater) => {
    setFiltersState((prev) =>
      typeof updater === 'function' ? (updater as (prev: EquipmentFilters) => EquipmentFilters)(prev) : updater,
    );
  }, []);

  useEffect(() => {
    let ignore = false;
    const controller = new AbortController();

    const fetchEquipment = async () => {
      setLoading(true);
      setError(null);
      try {
        const equipments = await equipmentService.list(filters, controller.signal);
        if (!ignore) setData(equipments);
      } catch (err) {
        if (!ignore) setError(err instanceof Error ? err.message : 'Failed to load equipment');
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchEquipment();
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
