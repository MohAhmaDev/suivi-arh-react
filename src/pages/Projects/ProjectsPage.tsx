import { useMemo, useState } from 'react';
import { Box, Paper, Typography, Divider } from '@mui/material';
import { useProjects } from '../../hooks/queries/useProjects';
import { useRegions } from '../../hooks/queries/useRegions';
import { ProjectFilters as Filters } from '../../components/projects/ProjectFilters';
import { ProjectList } from '../../components/projects/ProjectList';
import { LoadingState } from '../../components/feedback/LoadingState';
import { ErrorState } from '../../components/feedback/ErrorState';
import type { ProjectFilters, ProjectState } from '../../types/project';

export const ProjectsPage = () => {
  const [selectedRegion, setSelectedRegion] = useState<number | undefined>();
  const [selectedStatus, setSelectedStatus] = useState<ProjectState | undefined>();

  const {
    data: regions,
    loading: regionsLoading,
    error: regionsError,
  } = useRegions();

  const projectFilters = useMemo<ProjectFilters | undefined>(() => {
    const nextFilters: ProjectFilters = {};
    if (selectedRegion) nextFilters.region_id = selectedRegion;
    if (selectedStatus) nextFilters.etat = selectedStatus;
    return Object.keys(nextFilters).length ? nextFilters : undefined;
  }, [selectedRegion, selectedStatus]);

  const {
    data: projects,
    loading: projectsLoading,
    error: projectsError,
    refetch,
  } = useProjects(projectFilters);

  if (regionsLoading && regions.length === 0) {
    return <LoadingState message="Chargement des régions..." />;
  }

  if (regionsError) {
    return <ErrorState error={regionsError} />;
  }

  const handleResetFilters = () => {
    setSelectedRegion(undefined);
    setSelectedStatus(undefined);
  };

  return (
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box>
        <Typography variant="h4" gutterBottom>
          Projets
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Consultez la liste des projets, filtrez par région ou par état, puis accédez aux détails.
        </Typography>
      </Box>

      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Filtres</Typography>
          {(selectedRegion || selectedStatus) && (
            <Typography
              variant="body2"
              color="primary"
              sx={{ cursor: 'pointer' }}
              onClick={handleResetFilters}
            >
              Réinitialiser
            </Typography>
          )}
        </Box>
        <Divider sx={{ my: 2 }} />
        <Filters
          regions={regions}
          selectedRegion={selectedRegion}
          selectedStatus={selectedStatus}
          onRegionChange={setSelectedRegion}
          onStatusChange={setSelectedStatus}
        />
      </Paper>

      <ProjectList
        projects={projects}
        loading={projectsLoading}
        error={projectsError}
        onRetry={refetch}
      />
    </Box>
  );
};

export default ProjectsPage;
