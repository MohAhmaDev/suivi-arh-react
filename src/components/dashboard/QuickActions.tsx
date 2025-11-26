import { Button, Paper, Stack, Typography } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import SearchIcon from '@mui/icons-material/Search';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import { Link as RouterLink } from 'react-router-dom';

export const QuickActions = () => (
  <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', p: 3 }}>
    <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
      Actions rapides
    </Typography>
    <Stack spacing={1.5}>
      <Button
        component={RouterLink}
        to="/projects"
        startIcon={<SearchIcon />}
        variant="outlined"
        fullWidth
        sx={{ justifyContent: 'flex-start' }}
      >
        Parcourir les projets
      </Button>
      <Button
        component={RouterLink}
        to="/equipment"
        startIcon={<AddCircleIcon />}
        variant="outlined"
        fullWidth
        sx={{ justifyContent: 'flex-start' }}
      >
        Ajouter un équipement
      </Button>
      <Button
        component={RouterLink}
        to="/dossiers"
        startIcon={<FolderOpenIcon />}
        variant="outlined"
        fullWidth
        sx={{ justifyContent: 'flex-start' }}
      >
        Gérer les dossiers
      </Button>
    </Stack>
  </Paper>
);

export default QuickActions;
