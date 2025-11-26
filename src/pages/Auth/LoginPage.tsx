import { useState, type FormEvent } from 'react';
import { Navigate } from 'react-router-dom';
import { Alert, Avatar, Box, Fade, Typography } from '@mui/material';
import { LockOutlined } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { Button, Card, Input } from '../../components/shared/ui';

const LoginPage = () => {
  const { login, isAuthenticated } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(username, password);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Impossible de se connecter';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <Box
      component="main"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: { xs: 2, md: 4 },
        py: { xs: 4, md: 6 },
        bgcolor: 'background.default',
        backgroundImage:
          'radial-gradient(circle at 20% 20%, rgba(33,150,243,0.25), transparent 45%), radial-gradient(circle at 80% 0%, rgba(25,118,210,0.2), transparent 40%)',
      }}
    >
      <Fade in timeout={500}>
        <Card
          component="form"
          onSubmit={handleSubmit}
          sx={{
            width: '100%',
            maxWidth: 420,
            p: { xs: 3, md: 4 },
            borderRadius: '16px',
            boxShadow: '0 20px 25px -5px rgba(15,23,42,0.1)',
            backdropFilter: 'blur(6px)',
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Avatar
              sx={{
                bgcolor: 'primary.main',
                width: 56,
                height: 56,
                mx: 'auto',
                mb: 1,
              }}
            >
              <LockOutlined />
            </Avatar>
            <Typography variant="h2" sx={{ fontSize: '24px' }}>
              Connexion sécurisée
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Accédez à la plateforme ARH avec vos identifiants professionnels.
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Input
            label="Nom d'utilisateur"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            autoComplete="username"
            autoFocus
            required
          />

          <Input
            label="Mot de passe"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            required
          />

          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
            Vos données sont protégées. Besoin d'aide ? Contactez l'administrateur ARH.
          </Typography>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            loading={loading}
            sx={{ mt: 3 }}
          >
            Se connecter
          </Button>
        </Card>
      </Fade>
    </Box>
  );
};

export default LoginPage;
