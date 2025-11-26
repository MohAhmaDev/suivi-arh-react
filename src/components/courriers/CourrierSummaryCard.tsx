import { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import type { Courrier } from '../../types/courrier';
import { StatusChip } from '../shared/StatusChip';

interface CourrierSummaryCardProps {
  courriers: Courrier[];
  onSelect?: (courrier: Courrier) => void;
}

const formatDate = (value?: string | null) =>
  value ? new Date(value).toLocaleDateString('fr-FR') : '—';

export const CourrierSummaryCard = ({ courriers, onSelect }: CourrierSummaryCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const sorted = [...courriers].sort((a, b) => {
    const dateA = a.date_envoi || a.date_reception || '';
    const dateB = b.date_envoi || b.date_reception || '';
    return dateB.localeCompare(dateA);
  });

  const recentCourriers = sorted.slice(0, 3);

  return (
    <>
      <Box>
        {/* Summary Card */}
        <Stack spacing={2}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                backgroundColor: 'primary.50',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <MailOutlineIcon sx={{ fontSize: 24, color: 'primary.main' }} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontSize: '1.125rem', fontWeight: 600 }}>
                Courriers récents
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.95rem' }}>
                {courriers.length} courrier{courriers.length !== 1 ? 's' : ''} au total
              </Typography>
            </Box>
          </Stack>

          {recentCourriers.length > 0 ? (
            <Stack spacing={1.5}>
              {recentCourriers.map((courrier) => (
                <Paper
                  key={courrier.id}
                  elevation={0}
                  sx={{
                    p: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 2,
                    cursor: onSelect ? 'pointer' : 'default',
                    '&:hover': onSelect
                      ? {
                          borderColor: 'primary.main',
                          backgroundColor: 'primary.50',
                        }
                      : {},
                    transition: 'all 0.2s',
                  }}
                  onClick={() => onSelect?.(courrier)}
                >
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: 500,
                          fontSize: '1rem',
                          mb: 0.5,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {courrier.objet || 'Sans objet'}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontSize: '0.875rem', mb: 0.5 }}
                      >
                        {courrier.expediteur_nom} → {courrier.destinataire_nom}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                        {formatDate(courrier.date_envoi)}
                      </Typography>
                    </Box>
                    <StatusChip status={courrier.statut} />
                  </Stack>
                </Paper>
              ))}
            </Stack>
          ) : (
            <Paper
              elevation={0}
              sx={{
                p: 3,
                textAlign: 'center',
                border: '1px dashed',
                borderColor: 'divider',
                borderRadius: 2,
              }}
            >
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.95rem' }}>
                Aucun courrier disponible
              </Typography>
            </Paper>
          )}

          {courriers.length > 3 && (
            <Button
              variant="outlined"
              onClick={() => setIsModalOpen(true)}
              sx={{
                mt: 1,
                fontSize: '1rem',
                py: 1.25,
                fontWeight: 500,
              }}
            >
              Voir tous les courriers ({courriers.length})
            </Button>
          )}
        </Stack>
      </Box>

      {/* Full List Modal */}
      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            maxHeight: '80vh',
          },
        }}
      >
        <DialogTitle
          sx={{
            px: 3,
            py: 2.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 600, fontSize: '1.5rem' }}>
            Tous les courriers
          </Typography>
          <IconButton onClick={() => setIsModalOpen(false)} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ px: 3, py: 3 }}>
          <Stack spacing={2}>
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
                    <Box sx={{ width: 2, flex: 1, backgroundColor: 'divider', mt: 1, minHeight: 40 }} />
                  )}
                </Box>
                <Paper
                  elevation={0}
                  sx={{
                    flex: 1,
                    p: 2.5,
                    cursor: onSelect ? 'pointer' : 'default',
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 2,
                    '&:hover': onSelect
                      ? {
                          borderColor: 'primary.main',
                          backgroundColor: 'primary.50',
                        }
                      : {},
                    transition: 'all 0.2s',
                  }}
                  onClick={() => {
                    onSelect?.(courrier);
                    setIsModalOpen(false);
                  }}
                >
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontSize: '1.125rem', fontWeight: 600 }}>
                      {courrier.objet || 'Sans objet'}
                    </Typography>
                    <StatusChip status={courrier.statut} />
                  </Stack>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.95rem', mb: 1 }}>
                    {courrier.expediteur_nom} → {courrier.destinataire_nom}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: '0.875rem' }}>
                    Envoyé : {formatDate(courrier.date_envoi)} — Reçu : {formatDate(courrier.date_reception)}
                  </Typography>
                </Paper>
              </Stack>
            ))}
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
};
