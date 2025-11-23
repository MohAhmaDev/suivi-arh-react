import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Chip,
  Divider,
  Stack,
  Button,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useProjectDetail } from '../../hooks/queries/useProjectDetail';
import { EquipmentTable } from '../../components/equipment/EquipmentTable';
import { LoadingState } from '../../components/feedback/LoadingState';
import { ErrorState } from '../../components/feedback/ErrorState';

export const ProjectDetailPage = () => {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();
  const numericId = useMemo(() => Number(projectId), [projectId]);

  const { project, equipment, loading, error, refetch } = useProjectDetail(numericId);

  if (!projectId || Number.isNaN(numericId)) {
    return <ErrorState error="Identifiant de projet invalide" />;
  }

  if (loading) return <LoadingState message="Chargement du projet..." />;
  if (error) return <ErrorState error={error} onRetry={refetch} />;
  if (!project) return <ErrorState error="Projet introuvable" />;

  return (
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Stack direction="row" alignItems="center" spacing={1}>
        <Button
          variant="text"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
        >
          Retour
        </Button>
        <Typography variant="h4">{project.nom}</Typography>
      </Stack>

      <Paper sx={{ p: 3 }}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
          justifyContent="space-between"
          alignItems="flex-start"
          mb={2}
        >
          <Box>
            <Typography variant="h6" gutterBottom>
              Informations générales
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {project.region_nom} ({project.region_code})
            </Typography>
          </Box>
          <Chip label={project.etat} color="primary" />
        </Stack>

        {project.description && (
          <Typography variant="body1" sx={{ mb: 2 }}>
            {project.description}
          </Typography>
        )}

        <Divider sx={{ my: 2 }} />
        <Typography variant="body2" color="text.secondary">
          Créé le {new Date(project.date_creation).toLocaleDateString('fr-FR')}
        </Typography>
      </Paper>

      <Box>
        <Typography variant="h5" gutterBottom>
          Équipements ({equipment.length})
        </Typography>
        <EquipmentTable equipment={equipment} />
      </Box>
    </Box>
  );
};

export default ProjectDetailPage;
