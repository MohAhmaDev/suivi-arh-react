import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Box, Button, Paper, Stack, Typography } from '@mui/material';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Keep console logging available for debugging sessions.
    console.error('Unexpected render error', error, info);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return <>{this.props.fallback}</>;

      return (
        <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default', px: 2 }}>
          <Paper sx={{ p: 4, maxWidth: 480, width: '100%', textAlign: 'center' }} elevation={3}>
            <Typography variant="h5" gutterBottom>
              Oups, quelque chose s'est mal passé.
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              L'interface a rencontré une erreur inattendue. Vous pouvez réessayer ou recharger l'application.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} justifyContent="center">
              <Button variant="outlined" onClick={this.handleRetry}>
                Réessayer
              </Button>
              <Button variant="contained" onClick={this.handleReload}>
                Recharger
              </Button>
            </Stack>
            {import.meta.env.DEV && this.state.error && (
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 3 }}>
                {this.state.error.message}
              </Typography>
            )}
          </Paper>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
