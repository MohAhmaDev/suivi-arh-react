import {
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import VisibilityIcon from '@mui/icons-material/Visibility';
import type { DocumentMetadata } from '../../types/document';
import { EmptyState } from '../shared/EmptyState';

interface DocumentListProps {
  documents: DocumentMetadata[];
  onPreview?: (document: DocumentMetadata) => void;
  onDownload?: (document: DocumentMetadata) => void;
  title?: string;
}

const formatSize = (bytes: number) => {
  if (!bytes) return '0 Ko';
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} Ko`;
  return `${(kb / 1024).toFixed(1)} Mo`;
};

export const DocumentList = ({ documents, onPreview, onDownload, title = 'Documents' }: DocumentListProps) => {
  if (documents.length === 0) {
    return (
      <EmptyState
        title="Aucun document"
        description="Ajoutez des pièces jointes pour suivre les échanges."
      />
    );
  }

  return (
    <Paper sx={{ p: 2 }}>
      <Stack spacing={2}>
        <Typography variant="h6">{title}</Typography>
        <List>
          {documents.map((document) => (
            <ListItem key={document.id} divider>
              <ListItemText
                primary={document.nom_fichier}
                secondary={`${document.type_document} · ${formatSize(document.taille)} · Ajouté le ${new Date(
                  document.date_ajout,
                ).toLocaleDateString('fr-FR')}`}
              />
              <ListItemSecondaryAction>
                {onPreview && (
                  <IconButton edge="end" onClick={() => onPreview(document)}>
                    <VisibilityIcon />
                  </IconButton>
                )}
                {onDownload && (
                  <IconButton edge="end" onClick={() => onDownload(document)}>
                    <DownloadIcon />
                  </IconButton>
                )}
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Stack>
    </Paper>
  );
};
