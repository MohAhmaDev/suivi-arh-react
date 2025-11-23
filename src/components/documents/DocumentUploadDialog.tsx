import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  LinearProgress,
  Stack,
  TextField,
} from '@mui/material';
import { useState } from 'react';

interface DocumentUploadDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (file: File, description?: string) => void;
  submitting?: boolean;
  maxFileSizeMb?: number;
}

export const DocumentUploadDialog = ({
  open,
  onClose,
  onSubmit,
  submitting = false,
  maxFileSizeMb = 25,
}: DocumentUploadDialogProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setFile(null);
    setDescription('');
    setError(null);
  };

  const handleFileChange = (selectedFile: File | null) => {
    if (!selectedFile) {
      setFile(null);
      return;
    }
    if (selectedFile.size > maxFileSizeMb * 1024 * 1024) {
      setError(`Le fichier dépasse ${maxFileSizeMb} Mo.`);
      return;
    }
    setError(null);
    setFile(selectedFile);
  };

  const handleSubmit = () => {
    if (!file) {
      setError('Sélectionnez un fichier avant de continuer.');
      return;
    }
    onSubmit(file, description || undefined);
    reset();
  };

  const handleClose = () => {
    if (submitting) return;
    onClose();
    reset();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Ajouter un document</DialogTitle>
      {submitting && <LinearProgress />}
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <Button component="label" variant="outlined">
            {file ? file.name : 'Choisir un fichier'}
            <input
              type="file"
              hidden
              onChange={(event) => handleFileChange(event.target.files?.[0] ?? null)}
            />
          </Button>
          <TextField
            label="Description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            multiline
            minRows={2}
          />
          {error && (
            <TextField
              value={error}
              variant="standard"
              InputProps={{ readOnly: true }}
              sx={{ '& .MuiInputBase-input': { color: 'error.main' } }}
            />
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={submitting}>
          Annuler
        </Button>
        <Button onClick={handleSubmit} disabled={!file || submitting} variant="contained">
          Téléverser
        </Button>
      </DialogActions>
    </Dialog>
  );
};
