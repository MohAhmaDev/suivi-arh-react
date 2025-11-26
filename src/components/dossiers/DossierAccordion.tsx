import { useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import type { Dossier } from '../../types/dossier';
import { StatusChip } from '../shared/StatusChip';

interface DossierAccordionProps {
  dossiers: Dossier[];
  onView?: (dossier: Dossier) => void;
  onValidate?: (dossier: Dossier) => void;
  onReject?: (dossier: Dossier) => void;
}

const formatDate = (value?: string | null) =>
  value ? new Date(value).toLocaleDateString('fr-FR') : '—';

export const DossierAccordion = ({
  dossiers,
  onView,
  onValidate,
  onReject,
}: DossierAccordionProps) => {
  const [expanded, setExpanded] = useState<number | false>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedDossier, setSelectedDossier] = useState<Dossier | null>(null);

  const handleChange = (dossierId: number) => (_: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? dossierId : false);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, dossier: Dossier) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedDossier(dossier);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedDossier(null);
  };

  const handleAction = (action: () => void) => {
    action();
    handleMenuClose();
  };

  return (
    <>
      <Stack spacing={2}>
        {dossiers.map((dossier) => (
          <Accordion
            key={dossier.id}
            expanded={expanded === dossier.id}
            onChange={handleChange(dossier.id)}
            sx={{
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: '12px !important',
              '&:before': { display: 'none' },
              '&.Mui-expanded': {
                boxShadow: 'md',
                borderColor: 'primary.100',
              },
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon sx={{ fontSize: 22 }} />}
              sx={{
                px: 2.5,
                py: 1.5,
                '& .MuiAccordionSummary-content': {
                  my: 1,
                },
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ width: '100%', pr: 1, gap: 2 }}>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 0.5, flexWrap: 'wrap' }}>
                    <Typography variant="h6" sx={{ fontSize: '0.9375rem', fontWeight: 600 }}>
                      {dossier.type_dossier}
                    </Typography>
                    <StatusChip status={dossier.statut} />
                  </Stack>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8125rem' }}>
                    Projet : {dossier.equipement_projet}
                  </Typography>
                </Box>
                
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                      Créé le
                    </Typography>
                    <Typography variant="body1" sx={{ fontSize: '0.8125rem', fontWeight: 500 }}>
                      {formatDate(dossier.date_creation)}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                      Courriers
                    </Typography>
                    <Chip
                      label={dossier.nombre_courriers}
                      size="small"
                      sx={{
                        fontWeight: 600,
                        fontSize: '0.8125rem',
                        backgroundColor: 'primary.50',
                        color: 'primary.main',
                        minWidth: 32,
                        height: 24,
                      }}
                    />
                  </Box>

                  {(onView || onValidate || onReject) && (
                    <IconButton
                      onClick={(e) => handleMenuOpen(e, dossier)}
                      sx={{ ml: 1 }}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  )}
                </Stack>
              </Stack>
            </AccordionSummary>
            
            <AccordionDetails sx={{ px: 2.5, pb: 2.5, pt: 1, backgroundColor: 'grey.50' }}>
              <Stack spacing={1.5}>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                    gap: 1.5,
                  }}
                >
                  <Box
                    sx={{
                      p: 1.5,
                      backgroundColor: 'background.paper',
                      borderRadius: 1.5,
                      border: '1px solid',
                      borderColor: 'divider',
                    }}
                  >
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                      Type de dossier
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 0.25, fontSize: '0.875rem', fontWeight: 500 }}>
                      {dossier.type_dossier}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      p: 1.5,
                      backgroundColor: 'background.paper',
                      borderRadius: 1.5,
                      border: '1px solid',
                      borderColor: 'divider',
                    }}
                  >
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                      Statut
                    </Typography>
                    <Box sx={{ mt: 0.25 }}>
                      <StatusChip status={dossier.statut} />
                    </Box>
                  </Box>

                  {dossier.date_validation && (
                    <Box
                      sx={{
                        p: 1.5,
                        backgroundColor: 'background.paper',
                        borderRadius: 1.5,
                        border: '1px solid',
                        borderColor: 'divider',
                      }}
                    >
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                        Date de validation
                      </Typography>
                      <Typography variant="body1" sx={{ mt: 0.25, fontSize: '0.875rem', fontWeight: 500 }}>
                        {formatDate(dossier.date_validation)}
                      </Typography>
                    </Box>
                  )}
                </Box>

                {dossier.commentaire && (
                  <Box
                    sx={{
                      p: 1.5,
                      backgroundColor: 'background.paper',
                      borderRadius: 1.5,
                      border: '1px solid',
                      borderColor: 'divider',
                    }}
                  >
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                      Commentaire
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 0.5, fontSize: '0.8125rem' }}>
                      {dossier.commentaire}
                    </Typography>
                  </Box>
                )}
              </Stack>
            </AccordionDetails>
          </Accordion>
        ))}
      </Stack>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {onView && selectedDossier && (
          <MenuItem onClick={() => handleAction(() => onView(selectedDossier))}>
            <VisibilityIcon sx={{ mr: 1, fontSize: 20 }} />
            Consulter
          </MenuItem>
        )}
        {onValidate && selectedDossier && (
          <MenuItem onClick={() => handleAction(() => onValidate(selectedDossier))}>
            <CheckCircleOutlineIcon sx={{ mr: 1, fontSize: 20, color: 'success.main' }} />
            Valider
          </MenuItem>
        )}
        {onReject && selectedDossier && (
          <MenuItem onClick={() => handleAction(() => onReject(selectedDossier))}>
            <HighlightOffIcon sx={{ mr: 1, fontSize: 20, color: 'error.main' }} />
            Rejeter
          </MenuItem>
        )}
      </Menu>
    </>
  );
};
