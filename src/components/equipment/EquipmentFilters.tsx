import {
  Box,
  Chip,
  Divider,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import type { EquipmentFilters as EquipmentFilterParams, EquipmentState, EquipmentStatus } from '../../types/equipment';
import type { Project } from '../../types/project';

interface EquipmentFiltersProps {
  value: EquipmentFilterParams;
  onChange: (filters: EquipmentFilterParams) => void;
  projects?: Pick<Project, 'id' | 'nom'>[];
  showReset?: boolean;
}

const STATUS_OPTIONS: EquipmentStatus[] = ['En attente', 'En cours', 'Validé', 'Rejeté'];
const STATE_OPTIONS: EquipmentState[] = ['En service', 'En panne', 'Hors service'];

export const EquipmentFilters = ({ value, onChange, projects = [], showReset = true }: EquipmentFiltersProps) => {
  const handleStatusToggle = (status: EquipmentStatus) => {
    onChange({ ...value, statut: value.statut === status ? undefined : status });
  };

  const handleEtatChange = (etat?: EquipmentState) => {
    onChange({ ...value, etat });
  };

  const handleProjectChange = (projectId?: number) => {
    onChange({ ...value, projet: projectId });
  };

  const clearFilters = () => {
    onChange({});
  };

  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'background.paper',
      }}
    >
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'center' }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
            Statut
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {STATUS_OPTIONS.map((status) => (
              <Chip
                key={status}
                label={status}
                color={value.statut === status ? 'primary' : 'default'}
                variant={value.statut === status ? 'filled' : 'outlined'}
                onClick={() => handleStatusToggle(status)}
                size="small"
              />
            ))}
          </Stack>
        </Box>

        <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' } }} />

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} flex={1}>
          <TextField
            select
            fullWidth
            label="État"
            value={value.etat ?? ''}
            onChange={(event) => handleEtatChange((event.target.value as EquipmentState) || undefined)}
          >
            <MenuItem value="">Tous</MenuItem>
            {STATE_OPTIONS.map((state) => (
              <MenuItem key={state} value={state}>
                {state}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            fullWidth
            label="Projet"
            value={value.projet ?? ''}
            onChange={(event) =>
              handleProjectChange(event.target.value === '' ? undefined : Number(event.target.value))
            }
          >
            <MenuItem value="">Tous</MenuItem>
            {projects.map((project) => (
              <MenuItem key={project.id} value={project.id}>
                {project.nom}
              </MenuItem>
            ))}
          </TextField>
        </Stack>

        {showReset && (
          <Tooltip title="Réinitialiser les filtres">
            <IconButton color="primary" onClick={clearFilters}>
              <RestartAltIcon />
            </IconButton>
          </Tooltip>
        )}
      </Stack>
    </Box>
  );
};
