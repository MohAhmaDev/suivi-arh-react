import { Box, Typography, Button } from '@mui/material';
import { ErrorOutline } from '@mui/icons-material';

interface ErrorStateProps {
  error: string;
  onRetry?: () => void;
}

export const ErrorState = ({ error, onRetry }: ErrorStateProps) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '400px',
      gap: 2,
    }}
  >
    <ErrorOutline sx={{ fontSize: 64, color: 'error.main' }} />
    <Typography variant="h6" color="error">
      Une erreur est survenue
    </Typography>
    <Typography variant="body2" color="text.secondary">
      {error}
    </Typography>
    {onRetry && (
      <Button variant="contained" onClick={onRetry} sx={{ mt: 2 }}>
        Réessayer
      </Button>
    )}
  </Box>
);
