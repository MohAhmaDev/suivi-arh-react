import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useValidateDossier, useRejectDossier } from '../../hooks/mutations/useDossierMutations';

interface DossierDecisionDialogProps {
  open: boolean;
  dossierId: number;
  dossierLabel?: string;
  mode: 'validate' | 'reject';
  onClose: () => void;
  onSuccess?: (result: { id: number; statut: string }) => void;
}

export const DossierDecisionDialog = ({
  open,
  dossierId,
  dossierLabel,
  mode,
  onClose,
  onSuccess,
}: DossierDecisionDialogProps) => {
  const { validateDossier, loading: validating } = useValidateDossier();
  const { rejectDossier, loading: rejecting } = useRejectDossier();
  const [comment, setComment] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setComment('');
      setError(null);
    }
  }, [open]);

  const loading = mode === 'validate' ? validating : rejecting;
  const requireComment = mode === 'reject';

  const handleConfirm = async () => {
    if (requireComment && !comment.trim()) {
      setError('Un commentaire est requis pour un rejet.');
      return;
    }

    try {
      if (mode === 'validate') {
        await validateDossier(
          { id: dossierId, payload: comment ? { commentaire: comment } : undefined },
          {
            onSuccess: (result) => onSuccess?.(result),
          },
        );
      } else {
        await rejectDossier(
          { id: dossierId, payload: { commentaire: comment } },
          {
            onSuccess: (result) => onSuccess?.(result),
          },
        );
      }
      onClose();
    } catch {
      // snackbar already shows error
    }
  };

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {mode === 'validate' ? 'Valider ce dossier ?' : 'Rejeter ce dossier ?'}
      </DialogTitle>
      <DialogContent dividers>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {dossierLabel ? `Cible : ${dossierLabel}` : 'Confirmez votre action.'}
        </Typography>
        <TextField
          label="Commentaire"
          value={comment}
          onChange={(event) => {
            setComment(event.target.value);
            if (error) setError(null);
          }}
          helperText={error}
          error={Boolean(error)}
          multiline
          minRows={3}
          placeholder={requireComment ? 'Expliquez la raison du rejet' : 'Optionnel'}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Annuler
        </Button>
        <Button onClick={handleConfirm} disabled={loading} variant="contained" color={mode === 'validate' ? 'primary' : 'error'}>
          {mode === 'validate' ? 'Valider' : 'Rejeter'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
