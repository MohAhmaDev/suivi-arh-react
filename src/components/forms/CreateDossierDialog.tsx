import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import type { CreateDossierPayload, DossierStatus, DossierType } from '../../types/dossier';
import type { Dossier } from '../../types/dossier';
import { useCreateDossier } from '../../hooks/mutations/useDossierMutations';

interface CreateDossierDialogProps {
  open: boolean;
  equipmentId?: number;
  equipmentName?: string;
  equipmentOptions?: Array<{ id: number; label: string }>;
  onClose: () => void;
  onSuccess?: (dossier: Dossier) => void;
}

const STATUS_OPTIONS: DossierStatus[] = ['En cours', 'Validé', 'Concluant', 'Non concluant', 'Refusé'];
const TYPE_OPTIONS: DossierType[] = ['Préliminaire', 'Essai usine', 'Essai site', 'Procédure essai', 'HSE', 'Final'];

const DEFAULT_VALUES: CreateDossierPayload = {
  equipement: 0,
  type_dossier: 'Préliminaire',
  statut: 'En cours',
  commentaire: '',
};

export const CreateDossierDialog = ({
  open,
  equipmentId,
  equipmentName,
  equipmentOptions,
  onClose,
  onSuccess,
}: CreateDossierDialogProps) => {
  const initialEquipment = equipmentId ?? equipmentOptions?.[0]?.id ?? 0;
  const [values, setValues] = useState<CreateDossierPayload>({ ...DEFAULT_VALUES, equipement: initialEquipment });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { createDossier, loading } = useCreateDossier();

  useEffect(() => {
    if (open) {
      setValues({ ...DEFAULT_VALUES, equipement: equipmentId ?? equipmentOptions?.[0]?.id ?? 0 });
      setErrors({});
    }
  }, [open, equipmentId, equipmentOptions]);

  const handleChange = <K extends keyof CreateDossierPayload>(key: K, value: CreateDossierPayload[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (!values.equipement) nextErrors.equipement = 'Équipement requis';
    if (!values.type_dossier) nextErrors.type_dossier = 'Type requis';
    if (!values.statut) nextErrors.statut = 'Statut requis';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      await createDossier(values, {
        onSuccess: (dossier) => onSuccess?.(dossier),
      });
      onClose();
    } catch {
      // snackbar handles
    }
  };

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} fullWidth maxWidth="sm">
      <DialogTitle>Nouveau dossier</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2} sx={{ mt: 1 }}>
          {equipmentOptions && equipmentOptions.length > 0 ? (
            <TextField
              select
              label="Équipement"
              value={values.equipement || ''}
              onChange={(event) => handleChange('equipement', Number(event.target.value))}
              error={Boolean(errors.equipement)}
              helperText={errors.equipement}
              required
            >
              <MenuItem value="" disabled>
                Choisir un équipement
              </MenuItem>
              {equipmentOptions.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          ) : (
            <Typography variant="body2" color="text.secondary">
              Équipement cible : <strong>{equipmentName || (equipmentId ? `#${equipmentId}` : 'Non renseigné')}</strong>
            </Typography>
          )}

          <TextField
            select
            label="Type"
            value={values.type_dossier}
            onChange={(event) => handleChange('type_dossier', event.target.value as DossierType)}
            error={Boolean(errors.type_dossier)}
            helperText={errors.type_dossier}
            required
          >
            {TYPE_OPTIONS.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Statut"
            value={values.statut}
            onChange={(event) => handleChange('statut', event.target.value as DossierStatus)}
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
            label="Commentaire"
            multiline
            minRows={3}
            value={values.commentaire ?? ''}
            onChange={(event) => handleChange('commentaire', event.target.value)}
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
