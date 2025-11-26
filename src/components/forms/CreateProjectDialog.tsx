import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
} from '@mui/material';
import { useEffect, useState } from 'react';
import type { CreateProjectPayload, Project, ProjectState } from '../../types/project';
import type { Region } from '../../types/region';
import { useCreateProject } from '../../hooks/mutations/useProjectMutations';

interface CreateProjectDialogProps {
  open: boolean;
  regions: Region[];
  defaultRegionId?: number;
  onClose: () => void;
  onSuccess?: (project: Project) => void;
}

const STATE_OPTIONS: ProjectState[] = ['En préparation', 'En cours', 'Terminé'];

const DEFAULT_VALUES: CreateProjectPayload = {
  nom: '',
  region: 0,
  etat: 'En préparation',
  description: '',
};

export const CreateProjectDialog = ({
  open,
  regions,
  defaultRegionId,
  onClose,
  onSuccess,
}: CreateProjectDialogProps) => {
  const [values, setValues] = useState<CreateProjectPayload>({
    ...DEFAULT_VALUES,
    region: defaultRegionId ?? DEFAULT_VALUES.region,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { createProject, loading } = useCreateProject();

  useEffect(() => {
    if (open) {
      setValues((prev) => ({ ...prev, region: defaultRegionId ?? prev.region }));
      setErrors({});
    }
  }, [open, defaultRegionId]);

  const handleChange = <K extends keyof CreateProjectPayload>(key: K, value: CreateProjectPayload[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (!values.nom.trim()) nextErrors.nom = 'Nom requis';
    if (!values.region) nextErrors.region = 'Région requise';
    if (!values.etat) nextErrors.etat = 'État requis';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      await createProject(values, {
        onSuccess: (project) => onSuccess?.(project),
      });
      setValues({ ...DEFAULT_VALUES, region: defaultRegionId ?? 0 });
      onClose();
    } catch {
      // snackbar displays error
    }
  };

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} fullWidth maxWidth="sm">
      <DialogTitle>Nouveau projet</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Nom"
            value={values.nom}
            onChange={(event) => handleChange('nom', event.target.value)}
            error={Boolean(errors.nom)}
            helperText={errors.nom}
            required
            fullWidth
          />

          <TextField
            select
            label="Région"
            value={values.region || ''}
            onChange={(event) => handleChange('region', Number(event.target.value))}
            error={Boolean(errors.region)}
            helperText={errors.region || 'Sélectionnez la région support de ce projet'}
            required
          >
            <MenuItem value="" disabled>
              Choisir une région
            </MenuItem>
            {regions.map((region) => (
              <MenuItem key={region.id} value={region.id}>
                {region.nom}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="État"
            value={values.etat}
            onChange={(event) => handleChange('etat', event.target.value as ProjectState)}
            error={Boolean(errors.etat)}
            helperText={errors.etat}
            required
          >
            {STATE_OPTIONS.map((state) => (
              <MenuItem key={state} value={state}>
                {state}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Description"
            value={values.description ?? ''}
            onChange={(event) => handleChange('description', event.target.value)}
            multiline
            minRows={3}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Annuler
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loading || regions.length === 0}>
          Créer
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateProjectDialog;
