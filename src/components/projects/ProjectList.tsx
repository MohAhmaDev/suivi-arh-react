import Grid from '@mui/material/GridLegacy';
import Typography from '@mui/material/Typography';
import { ProjectCard } from './ProjectCard';
import { LoadingState } from '../feedback/LoadingState';
import { ErrorState } from '../feedback/ErrorState';
import type { Project } from '../../types/project';

interface ProjectListProps {
  projects: Project[];
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

export const ProjectList = ({ projects, loading, error, onRetry }: ProjectListProps) => {
  if (loading) return <LoadingState message="Chargement des projets..." />;
  if (error) return <ErrorState error={error} onRetry={onRetry} />;

  if (projects.length === 0) {
    return (
      <Typography variant="body1" color="text.secondary" sx={{ mt: 4, textAlign: 'center' }}>
        Aucun projet trouvé
      </Typography>
    );
  }

  return (
    <Grid container spacing={3} sx={{ mt: 2 }}>
      {projects.map((project) => (
        <Grid item xs={12} sm={6} md={4} key={project.id}>
          <ProjectCard project={project} />
        </Grid>
      ))}
    </Grid>
  );
};
