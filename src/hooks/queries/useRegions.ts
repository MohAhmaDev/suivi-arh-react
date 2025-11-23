import { useEffect, useState } from 'react';
import { regionService } from '../../services/regionService';
import type { Region } from '../../types/region';

export const useRegions = () => {
  const [data, setData] = useState<Region[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    const fetchRegions = async () => {
      setLoading(true);
      setError(null);
      try {
        const regions = await regionService.list();
        if (!ignore) setData(regions);
      } catch (err) {
        if (!ignore) setError(err instanceof Error ? err.message : 'Failed to load regions');
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchRegions();
    return () => {
      ignore = true;
    };
  }, []);

  return { data, loading, error };
};
