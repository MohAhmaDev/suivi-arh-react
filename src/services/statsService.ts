import { projectService } from './projectService';
import { equipmentService } from './equipmentService';
import { courrierService } from './courrierService';
import { dossierService } from './dossierService';
import { historyService } from './historyService';
import type { DashboardStats, RecentActivity } from '../types/stats';
import type { Project } from '../types/project';
import type { Equipment } from '../types/equipment';
import type { Courrier } from '../types/courrier';

const countBy = <T>(items: T[], selector: (item: T) => string | null | undefined) => {
  const counts: Record<string, number> = {};
  items.forEach((item) => {
    const key = selector(item);
    if (!key) return;
    counts[key] = (counts[key] || 0) + 1;
  });
  return counts;
};

const buildProjectStats = (projects: Project[]) => ({
  total: projects.length,
  par_etat: countBy(projects, (project) => project.etat),
});

const buildEquipmentStats = (equipment: Equipment[]) => ({
  total: equipment.length,
  par_statut: countBy(equipment, (item) => item.statut),
  par_etat: countBy(equipment, (item) => item.etat),
});

const buildCourrierStats = (courriers: Courrier[]) => ({
  total: courriers.length,
  par_statut: countBy(courriers, (courrier) => courrier.statut),
});

export const statsService = {
  getDashboardStats: async (): Promise<DashboardStats> => {
    const [projects, equipment, dossierStats, courriers] = await Promise.all([
      projectService.list(),
      equipmentService.list(),
      dossierService.stats(),
      courrierService.list(),
    ]);

    return {
      projets: buildProjectStats(projects),
      equipements: buildEquipmentStats(equipment),
      dossiers: dossierStats,
      courriers: buildCourrierStats(courriers),
    };
  },

  getRecentActivity: (limit = 15): Promise<RecentActivity[]> =>
    historyService.list({ limit }),
};
