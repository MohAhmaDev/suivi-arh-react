import { useEffect, useMemo, useState } from 'react';
import { projectService } from '../../services/projectService';
import type { Project, ProjectFilters } from '../../types/project';

export const useProjects = (filters?: ProjectFilters) => {
  const [data, setData] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reloadIndex, setReloadIndex] = useState(0);

  const filtersKey = useMemo(() => JSON.stringify(filters ?? {}), [filters]);

  useEffect(() => {
    let ignore = false;

    const fetchProjects = async () => {
      setLoading(true);
      setError(null);
      try {
        const projects = await projectService.list(filters);
        if (!ignore) setData(projects);
      } catch (err) {
        if (!ignore) setError(err instanceof Error ? err.message : 'Failed to load projects');
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchProjects();
    return () => {
      ignore = true;
    };
  }, [filtersKey, reloadIndex]);

  return {
    data,
    loading,
    error,
    refetch: () => setReloadIndex((prev) => prev + 1),
  };
};
