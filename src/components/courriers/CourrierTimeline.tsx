import { Box, Paper, Stack, Typography } from '@mui/material';
import type { Courrier } from '../../types/courrier';
import { StatusChip } from '../shared/StatusChip';

interface CourrierTimelineProps {
  courriers: Courrier[];
  onSelect?: (courrier: Courrier) => void;
}

const formatDate = (value?: string | null) =>
  value ? new Date(value).toLocaleString('fr-FR') : '—';

export const CourrierTimeline = ({ courriers, onSelect }: CourrierTimelineProps) => {
  const sorted = [...courriers].sort((a, b) => {
    const dateA = a.date_envoi || a.date_reception || '';
    const dateB = b.date_envoi || b.date_reception || '';
    return dateB.localeCompare(dateA);
  });

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Historique des courriers
      </Typography>
      <Stack spacing={3}>
        {sorted.map((courrier, index) => (
          <Stack key={courrier.id} direction="row" spacing={2} alignItems="flex-start">
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  backgroundColor: 'primary.main',
                  mt: index === 0 ? '6px' : 0,
                }}
              />
              {index < sorted.length - 1 && (
                <Box sx={{ width: 2, flex: 1, backgroundColor: 'divider', mt: 1 }} />
              )}
            </Box>
            <Paper
              elevation={0}
              sx={{
                flex: 1,
                p: 2,
                cursor: onSelect ? 'pointer' : 'default',
                border: '1px solid',
                borderColor: 'divider',
              }}
              onClick={() => onSelect?.(courrier)}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="subtitle1">{courrier.objet || 'Sans objet'}</Typography>
                <StatusChip status={courrier.statut} />
              </Stack>
              <Typography variant="body2" color="text.secondary">
                {courrier.expediteur_nom} → {courrier.destinataire_nom}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                Envoyé : {formatDate(courrier.date_envoi)} — Reçu : {formatDate(courrier.date_reception)}
              </Typography>
            </Paper>
          </Stack>
        ))}
        {sorted.length === 0 && (
          <Typography variant="body2" color="text.secondary">
            Aucun courrier pour ce dossier.
          </Typography>
        )}
      </Stack>
    </Paper>
  );
};
