import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useDossiers } from '../../hooks/queries/useDossiers';
import { useValidateDossier, useRejectDossier } from '../../hooks/mutations/useDossierMutations';
import { DossierFilters } from '../../components/dossiers/DossierFilters';
import { DossierTable } from '../../components/dossiers/DossierTable';
import { DossierDecisionDialog } from '../../components/forms/DossierDecisionDialog';
import { LoadingState } from '../../components/feedback/LoadingState';
import { ErrorState } from '../../components/feedback/ErrorState';
import { EmptyState } from '../../components/shared/EmptyState';
import type { Dossier } from '../../types/dossier';

type TableSortKey = 'type_dossier' | 'statut' | 'date_creation' | 'nombre_courriers';
type TableSortDirection = 'asc' | 'desc';

interface BulkRejectDialogProps {
  open: boolean;
  loading: boolean;
  onClose: () => void;
  onConfirm: (comment: string) => void;
}

const BulkRejectDialog = ({ open, loading, onClose, onConfirm }: BulkRejectDialogProps) => {
  const [comment, setComment] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setComment('');
      setError(null);
    }
  }, [open]);

  const handleSubmit = () => {
    if (!comment.trim()) {
      setError('Un commentaire est requis pour un rejet.');
      return;
    }
    onConfirm(comment.trim());
  };

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Rejeter les dossiers sélectionnés</DialogTitle>
      <DialogContent>
        <TextField
          label="Commentaire"
          value={comment}
          onChange={(event) => {
            setComment(event.target.value);
            if (error) setError(null);
          }}
          error={Boolean(error)}
          helperText={error ?? 'Expliquez la raison du rejet (requis)'}
          multiline
          minRows={3}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Annuler
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="error" disabled={loading}>
          Rejeter
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export const DossiersPage = () => {
  const { data, filters, setFilters, loading, error, refetch } = useDossiers();
  const { validateDossier } = useValidateDossier();
  const { rejectDossier } = useRejectDossier();

  const [sortBy, setSortBy] = useState<TableSortKey>('date_creation');
  const [sortDirection, setSortDirection] = useState<TableSortDirection>('desc');
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [decisionDialog, setDecisionDialog] = useState<{ open: boolean; mode: 'validate' | 'reject'; dossier: Dossier | null }>({
    open: false,
    mode: 'validate',
    dossier: null,
  });
  const [bulkRejectOpen, setBulkRejectOpen] = useState(false);
  const [bulkProcessing, setBulkProcessing] = useState(false);

  const selectedCount = selectedIds.size;

  const handleToggleSelect = (dossier: Dossier) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(dossier.id)) next.delete(dossier.id);
      else next.add(dossier.id);
      return next;
    });
  };

  const handleToggleSelectAll = (checked: boolean) => {
    setSelectedIds(checked ? new Set(data.map((dossier) => dossier.id)) : new Set());
  };

  const clearSelection = () => setSelectedIds(new Set());

  const handleBulkValidate = async () => {
    if (!selectedCount) return;
    setBulkProcessing(true);
    try {
      for (const id of selectedIds) {
        try {
          await validateDossier({ id, payload: undefined });
        } catch {
          // continue to next dossier; snackbar already displays error
        }
      }
      clearSelection();
      refetch();
    } finally {
      setBulkProcessing(false);
    }
  };

  const handleBulkReject = async (comment: string) => {
    setBulkProcessing(true);
    try {
      for (const id of selectedIds) {
        try {
          await rejectDossier({ id, payload: { commentaire: comment } });
        } catch {
          // continue processing remaining dossiers
        }
      }
      clearSelection();
      refetch();
      setBulkRejectOpen(false);
    } finally {
      setBulkProcessing(false);
    }
  };

  const openDecisionDialog = (mode: 'validate' | 'reject', dossier: Dossier) => {
    setDecisionDialog({ open: true, mode, dossier });
  };

  const closeDecisionDialog = () => setDecisionDialog((prev) => ({ ...prev, open: false }));

  const handleDecisionSuccess = () => {
    if (decisionDialog.dossier) {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(decisionDialog.dossier!.id);
        return next;
      });
    }
    refetch();
  };

  if (loading && data.length === 0) {
    return <LoadingState message="Chargement des dossiers..." />;
  }

  if (error && data.length === 0) {
    return <ErrorState error={error} onRetry={refetch} />;
  }

  return (
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} spacing={2}>
        <Box>
          <Typography variant="h4">Dossiers</Typography>
          <Typography variant="body2" color="text.secondary">
            Consolidez et validez les dossiers tous équipements confondus.
          </Typography>
        </Box>
        {selectedCount > 0 && (
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
            <Button variant="outlined" color="error" onClick={() => setBulkRejectOpen(true)} disabled={bulkProcessing}>
              Rejeter ({selectedCount})
            </Button>
            <Button variant="contained" onClick={handleBulkValidate} disabled={bulkProcessing}>
              Valider ({selectedCount})
            </Button>
          </Stack>
        )}
      </Stack>

      <DossierFilters value={filters} onChange={setFilters} />

      {error && data.length > 0 && <ErrorState error={error} onRetry={refetch} />}

      {data.length === 0 ? (
        <EmptyState
          title="Aucun dossier"
          description="Ajustez vos filtres ou créez un dossier depuis une fiche équipement."
          actionLabel="Réinitialiser"
          onAction={() => setFilters({})}
        />
      ) : (
        <DossierTable
          dossiers={data}
          sortBy={sortBy}
          sortDirection={sortDirection}
          onSortChange={(key, direction) => {
            setSortBy(key);
            setSortDirection(direction);
          }}
          selectable
          selectedIds={selectedIds}
          onToggleSelect={handleToggleSelect}
          onToggleSelectAll={handleToggleSelectAll}
          onValidate={(dossier) => openDecisionDialog('validate', dossier)}
          onReject={(dossier) => openDecisionDialog('reject', dossier)}
        />
      )}

      <DossierDecisionDialog
        open={decisionDialog.open}
        dossierId={decisionDialog.dossier?.id ?? 0}
        dossierLabel={decisionDialog.dossier?.type_dossier}
        mode={decisionDialog.mode}
        onClose={closeDecisionDialog}
        onSuccess={handleDecisionSuccess}
      />

      <BulkRejectDialog
        open={bulkRejectOpen}
        loading={bulkProcessing}
        onClose={() => setBulkRejectOpen(false)}
        onConfirm={handleBulkReject}
      />
    </Box>
  );
};

export default DossiersPage;
