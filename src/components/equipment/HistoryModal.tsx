import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import type { HistoryEntry } from '../../types/history';
import { EmptyState } from '../shared/EmptyState';

interface HistoryModalProps {
  open: boolean;
  onClose: () => void;
  history: HistoryEntry[];
}

export const HistoryModal = ({ open, onClose, history }: HistoryModalProps) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
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
          Historique de l'équipement
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: 3, py: 3 }}>
        {history.length === 0 ? (
          <Box sx={{ py: 4 }}>
            <EmptyState
              title="Aucun événement"
              description="Aucune activité récente pour cet équipement."
            />
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {history.map((entry: HistoryEntry, index: number) => (
              <ListItem
                key={entry.id}
                divider={index < history.length - 1}
                sx={{
                  px: 2,
                  py: 2.5,
                  '&:hover': {
                    backgroundColor: 'grey.50',
                  },
                  borderRadius: 1,
                }}
              >
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 500,
                      fontSize: '1rem',
                      mb: 0.5,
                    }}
                  >
                    {entry.action}
                  </Typography>
                  <ListItemText
                    primary={
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontSize: '0.95rem' }}
                      >
                        Par {entry.user_username}
                      </Typography>
                    }
                    secondary={
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ fontSize: '0.875rem', mt: 0.5 }}
                      >
                        {new Date(entry.date_action).toLocaleString('fr-FR', {
                          dateStyle: 'long',
                          timeStyle: 'short',
                        })}
                      </Typography>
                    }
                  />
                </Box>
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>
    </Dialog>
  );
};
