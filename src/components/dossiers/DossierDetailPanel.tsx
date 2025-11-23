import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/GridLegacy';
import type { Dossier } from '../../types/dossier';
import type { Courrier } from '../../types/courrier';
import { EmptyState } from '../shared/EmptyState';
import { StatusChip } from '../shared/StatusChip';

interface DossierDetailPanelProps {
  dossier: Dossier | null;
  courriers: Courrier[];
  onCourrierSelect?: (courrier: Courrier) => void;
}

const formatDate = (value?: string | null) =>
  value ? new Date(value).toLocaleDateString('fr-FR') : '—';

export const DossierDetailPanel = ({ dossier, courriers, onCourrierSelect }: DossierDetailPanelProps) => {
  if (!dossier) {
    return (
      <EmptyState
        title="Aucun dossier sélectionné"
        description="Choisissez un dossier pour afficher ses informations et ses courriers."
      />
    );
  }

  const recentCourriers = courriers.slice(0, 5);

  return (
    <Paper sx={{ p: 3 }}>
      <Stack spacing={3}>
        <Box>
          <Typography variant="h6">{dossier.type_dossier}</Typography>
          <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
            <StatusChip status={dossier.statut} />
            {dossier.commentaire && (
              <Typography variant="body2" color="text.secondary">
                {dossier.commentaire}
              </Typography>
            )}
          </Stack>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">
              Créé le
            </Typography>
            <Typography variant="body1">{formatDate(dossier.date_creation)}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">
              Validé le
            </Typography>
            <Typography variant="body1">{formatDate(dossier.date_validation)}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">
              Créé par
            </Typography>
            <Typography variant="body1">{dossier.cree_par_username}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">
              Validé par
            </Typography>
            <Typography variant="body1">{dossier.valide_par_username || '—'}</Typography>
          </Grid>
        </Grid>

        <Divider />

        <Box>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="subtitle1">Courriers récents</Typography>
            <Typography variant="caption" color="text.secondary">
              {dossier.nombre_courriers} au total
            </Typography>
          </Stack>
          {recentCourriers.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Aucun courrier associé
            </Typography>
          ) : (
            <List>
              {recentCourriers.map((courrier) => (
                <ListItem key={courrier.id} divider disablePadding>
                  <ListItemButton onClick={() => onCourrierSelect?.(courrier)} disabled={!onCourrierSelect}>
                    <ListItemText
                      primary={courrier.objet || 'Courrier sans objet'}
                      secondary={`${courrier.expediteur_nom} → ${courrier.destinataire_nom} · ${
                        courrier.date_envoi ? new Date(courrier.date_envoi).toLocaleDateString('fr-FR') : '—'
                      }`}
                    />
                    <StatusChip status={courrier.statut} variant="outlined" />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      </Stack>
    </Paper>
  );
};
