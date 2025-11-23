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
import type { CreateCourrierPayload, CourrierStatus } from '../../types/courrier';

interface Option {
  id: number;
  label: string;
}

interface CourrierFormDialogProps {
  open: boolean;
  dossierOptions: Option[];
  userOptions: Option[];
  defaultValues?: Partial<CreateCourrierPayload>;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (values: CreateCourrierPayload) => void;
}

const STATUS_OPTIONS: CourrierStatus[] = ['Envoyé', 'Reçu', 'Lu', 'Traité'];

export const CourrierFormDialog = ({
  open,
  dossierOptions,
  userOptions,
  defaultValues,
  loading = false,
  onClose,
  onSubmit,
}: CourrierFormDialogProps) => {
  const [formValues, setFormValues] = useState<CreateCourrierPayload>({
    dossier: defaultValues?.dossier || dossierOptions[0]?.id || 0,
    expediteur: defaultValues?.expediteur || userOptions[0]?.id || 0,
    destinataire: defaultValues?.destinataire || userOptions[0]?.id || 0,
    objet: defaultValues?.objet || '',
    reference: defaultValues?.reference || '',
    commentaire: defaultValues?.commentaire || '',
    statut: defaultValues?.statut || 'Envoyé',
  });

  useEffect(() => {
    setFormValues((prev) => ({
      ...prev,
      ...defaultValues,
    }));
  }, [defaultValues]);

  const updateField = <K extends keyof CreateCourrierPayload>(key: K, value: CreateCourrierPayload[K]) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    if (!formValues.dossier || !formValues.expediteur || !formValues.destinataire) {
      return;
    }
    onSubmit(formValues);
  };

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} fullWidth maxWidth="sm">
      <DialogTitle>Nouveau courrier</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            select
            label="Dossier"
            value={formValues.dossier}
            onChange={(event) => updateField('dossier', Number(event.target.value))}
            fullWidth
          >
            {dossierOptions.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Expéditeur"
            value={formValues.expediteur}
            onChange={(event) => updateField('expediteur', Number(event.target.value))}
            fullWidth
          >
            {userOptions.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Destinataire"
            value={formValues.destinataire}
            onChange={(event) => updateField('destinataire', Number(event.target.value))}
            fullWidth
          >
            {userOptions.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Objet"
            value={formValues.objet ?? ''}
            onChange={(event) => updateField('objet', event.target.value)}
            fullWidth
          />

          <TextField
            label="Référence"
            value={formValues.reference ?? ''}
            onChange={(event) => updateField('reference', event.target.value)}
            fullWidth
          />

          <TextField
            label="Commentaire"
            value={formValues.commentaire ?? ''}
            onChange={(event) => updateField('commentaire', event.target.value)}
            fullWidth
            multiline
            minRows={3}
          />

          <TextField
            select
            label="Statut"
            value={formValues.statut || 'Envoyé'}
            onChange={(event) => updateField('statut', event.target.value as CourrierStatus)}
            fullWidth
          >
            {STATUS_OPTIONS.map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Annuler
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loading}>
          Enregistrer
        </Button>
      </DialogActions>
    </Dialog>
  );
};
