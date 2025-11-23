import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import type { ReactNode } from 'react';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog = ({
  open,
  title,
  description,
  confirmLabel = 'Confirmer',
  cancelLabel = 'Annuler',
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) => (
  <Dialog open={open} onClose={loading ? undefined : onCancel} maxWidth="xs" fullWidth>
    <DialogTitle>{title}</DialogTitle>
    {description && (
      <DialogContent>
        <DialogContentText component="div">{description}</DialogContentText>
      </DialogContent>
    )}
    <DialogActions>
      <Button onClick={onCancel} disabled={loading}>
        {cancelLabel}
      </Button>
      <Button onClick={onConfirm} variant="contained" disabled={loading}>
        {confirmLabel}
      </Button>
    </DialogActions>
  </Dialog>
);
