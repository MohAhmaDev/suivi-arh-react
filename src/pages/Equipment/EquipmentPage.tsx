import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/GridLegacy';
import { useEquipment } from '../../hooks/queries/useEquipment';
import { useProjects } from '../../hooks/queries/useProjects';
import { EquipmentFilters } from '../../components/equipment/EquipmentFilters';
import { EquipmentCard } from '../../components/equipment/EquipmentCard';
import { CreateEquipmentDialog } from '../../components/forms/CreateEquipmentDialog';
import { LoadingState } from '../../components/feedback/LoadingState';
import { ErrorState } from '../../components/feedback/ErrorState';
import { EmptyState } from '../../components/shared/EmptyState';
import type { Project } from '../../types/project';

const mapProjectsToOptions = (projects: Project[]) => projects.map((project) => ({ id: project.id, nom: project.nom }));

export const EquipmentPage = () => {
  const navigate = useNavigate();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const {
    data: equipments,
    filters,
    setFilters,
    loading,
    error,
    refetch,
  } = useEquipment();

  const {
    data: projects,
    loading: projectsLoading,
    error: projectsError,
  } = useProjects();

  const projectOptions = useMemo(() => mapProjectsToOptions(projects), [projects]);

  const handleEquipmentClick = (equipmentId: number) => {
    navigate(`/equipment/${equipmentId}`);
  };

  const shouldShowLoading = loading && equipments.length === 0;
  const shouldShowError = error && equipments.length === 0;

  if (shouldShowLoading || projectsLoading) {
    return <LoadingState message="Chargement des équipements..." />;
  }

  if (shouldShowError || projectsError) {
    return <ErrorState error={error ?? projectsError ?? 'Une erreur est survenue'} onRetry={refetch} />;
  }

  return (
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'stretch', md: 'center' }} spacing={2}>
        <Box>
          <Typography variant="h4">Équipements</Typography>
          <Typography variant="body2" color="text.secondary">
            Filtrez vos équipements par projet, statut ou état puis ouvrez le détail pour suivre les dossiers associés.
          </Typography>
        </Box>
        <Button variant="contained" onClick={() => setIsCreateOpen(true)}>
          Nouvel équipement
        </Button>
      </Stack>

      <EquipmentFilters value={filters} onChange={setFilters} projects={projectOptions} />

      {equipments.length === 0 ? (
        <EmptyState
          title="Aucun équipement"
          description="Ajustez vos filtres ou créez un équipement pour commencer."
          actionLabel="Réinitialiser"
          onAction={() => setFilters({})}
        />
      ) : (
        <Grid container spacing={3}>
          {equipments.map((equipment) => (
            <Grid item xs={12} sm={6} md={4} key={equipment.id}>
              <EquipmentCard equipment={equipment} onSelect={() => handleEquipmentClick(equipment.id)} />
            </Grid>
          ))}
        </Grid>
      )}

      <CreateEquipmentDialog
        open={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={() => {
          refetch();
          setIsCreateOpen(false);
        }}
        projects={projectOptions}
        defaultProjectId={filters.projet}
      />
    </Box>
  );
};

export default EquipmentPage;
