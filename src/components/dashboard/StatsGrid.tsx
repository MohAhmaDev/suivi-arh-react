import { Box } from '@mui/material';
import WorkspacesIcon from '@mui/icons-material/Workspaces';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import FolderIcon from '@mui/icons-material/Folder';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import { StatCard } from './StatCard';
import type { DashboardStats } from '../../types/stats';

interface StatsGridProps {
  stats: DashboardStats;
}

export const StatsGrid = ({ stats }: StatsGridProps) => (
  <Box
    sx={{
      display: 'grid',
      gap: 3,
      gridTemplateColumns: {
        xs: '1fr',
        sm: 'repeat(2, minmax(0, 1fr))',
        lg: 'repeat(4, minmax(0, 1fr))',
      },
    }}
  >
    <StatCard
      title="Projets"
      value={stats.projets.total}
      subtitle={`${stats.projets.par_etat['En cours'] || 0} en cours`}
      icon={<WorkspacesIcon />}
    />
    <StatCard
      title="Équipements"
      value={stats.equipements.total}
      subtitle={`${stats.equipements.par_statut['Validé'] || 0} validés`}
      icon={<PrecisionManufacturingIcon />}
    />
    <StatCard
      title="Dossiers"
      value={stats.dossiers.total}
      subtitle={`${stats.dossiers.par_statut['En cours'] || 0} en cours`}
      icon={<FolderIcon />}
    />
    <StatCard
      title="Courriers"
      value={stats.courriers.total}
      subtitle={`${stats.courriers.par_statut['Traité'] || 0} traités`}
      icon={<MailOutlineIcon />}
    />
  </Box>
);

export default StatsGrid;
