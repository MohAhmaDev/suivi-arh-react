import { useEffect, useState } from 'react';
import { projectService } from '../../services/projectService';
import type { Project } from '../../types/project';
import type { Equipment } from '../../types/equipment';

export const useProjectDetail = (id: number) => {
  const [project, setProject] = useState<Project | null>(null);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reloadIndex, setReloadIndex] = useState(0);

  useEffect(() => {
    let ignore = false;

    const fetchDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const [projectData, equipmentData] = await Promise.all([
          projectService.detail(id),
          projectService.getEquipment(id),
        ]);
        if (!ignore) {
          setProject(projectData);
          setEquipment(equipmentData);
        }
      } catch (err) {
        if (!ignore) setError(err instanceof Error ? err.message : 'Failed to load project');
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchDetail();
    return () => {
      ignore = true;
    };
  }, [id, reloadIndex]);

  return {
    project,
    equipment,
    loading,
    error,
    refetch: () => setReloadIndex((prev) => prev + 1),
  };
};
