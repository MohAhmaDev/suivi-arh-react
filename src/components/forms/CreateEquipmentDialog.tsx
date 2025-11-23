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
import type { CreateEquipmentPayload, EquipmentState, EquipmentStatus } from '../../types/equipment';
import type { Equipment } from '../../types/equipment';
import type { Project } from '../../types/project';
import { useCreateEquipment } from '../../hooks/mutations/useEquipmentMutations';

interface CreateEquipmentDialogProps {
  open: boolean;
  projects: Pick<Project, 'id' | 'nom'>[];
  defaultProjectId?: number;
  onClose: () => void;
  onSuccess?: (equipment: Equipment) => void;
}

const STATUS_OPTIONS: EquipmentStatus[] = ['En attente', 'En cours', 'Validé', 'Rejeté'];
const STATE_OPTIONS: EquipmentState[] = ['En service', 'En panne', 'Hors service'];

const DEFAULT_VALUES: CreateEquipmentPayload = {
  projet: 0,
  nom: '',
  statut: 'En attente',
  localisation: '',
  etat: 'En service',
  reference: '',
  numero_serie: '',
  date_installation: '',
};

export const CreateEquipmentDialog = ({
  open,
  projects,
  defaultProjectId,
  onClose,
  onSuccess,
}: CreateEquipmentDialogProps) => {
  const [values, setValues] = useState<CreateEquipmentPayload>({
    ...DEFAULT_VALUES,
    projet: defaultProjectId ?? DEFAULT_VALUES.projet,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { createEquipment, loading } = useCreateEquipment();

  useEffect(() => {
    if (open) {
      setValues((prev) => ({ ...prev, projet: defaultProjectId ?? prev.projet }));
      setErrors({});
    }
  }, [open, defaultProjectId]);

  const handleChange = <K extends keyof CreateEquipmentPayload>(key: K, value: CreateEquipmentPayload[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (!values.nom.trim()) nextErrors.nom = 'Nom requis';
    if (!values.projet) nextErrors.projet = 'Projet requis';
    if (!values.statut) nextErrors.statut = 'Statut requis';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      await createEquipment(values, {
        onSuccess: (equipment) => onSuccess?.(equipment),
      });
      setValues({ ...DEFAULT_VALUES, projet: defaultProjectId ?? 0 });
      onClose();
    } catch {
      // error handled by snackbar
    }
  };

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} fullWidth maxWidth="sm">
      <DialogTitle>Nouvel équipement</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Nom"
            value={values.nom}
            onChange={(event) => handleChange('nom', event.target.value)}
            error={Boolean(errors.nom)}
            helperText={errors.nom}
            fullWidth
            required
          />

          <TextField
            select
            label="Projet"
            value={values.projet || ''}
            onChange={(event) => handleChange('projet', Number(event.target.value))}
            error={Boolean(errors.projet)}
            helperText={errors.projet}
            required
          >
            <MenuItem value="" disabled>
              Choisir un projet
            </MenuItem>
            {projects.map((project) => (
              <MenuItem key={project.id} value={project.id}>
                {project.nom}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Statut"
            value={values.statut}
            onChange={(event) => handleChange('statut', event.target.value as EquipmentStatus)}
            error={Boolean(errors.statut)}
            helperText={errors.statut}
            required
          >
            {STATUS_OPTIONS.map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="État"
            value={values.etat || ''}
            onChange={(event) => handleChange('etat', event.target.value as EquipmentState)}
          >
            {STATE_OPTIONS.map((state) => (
              <MenuItem key={state} value={state}>
                {state}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Localisation"
            value={values.localisation ?? ''}
            onChange={(event) => handleChange('localisation', event.target.value)}
          />

          <TextField
            label="Référence"
            value={values.reference ?? ''}
            onChange={(event) => handleChange('reference', event.target.value)}
          />

          <TextField
            label="Numéro de série"
            value={values.numero_serie ?? ''}
            onChange={(event) => handleChange('numero_serie', event.target.value)}
          />

          <TextField
            label="Date d'installation"
            type="date"
            value={values.date_installation ?? ''}
            onChange={(event) => handleChange('date_installation', event.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Annuler
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loading}>
          Créer
        </Button>
      </DialogActions>
    </Dialog>
  );
};
