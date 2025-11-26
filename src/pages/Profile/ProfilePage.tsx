import {
  Alert,
  Avatar,
  Box,
  Breadcrumbs,
  CircularProgress,
  Link,
  Stack,
  Typography,
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Grid from '@mui/material/GridLegacy';
import LogoutIcon from '@mui/icons-material/Logout';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CloudSyncIcon from '@mui/icons-material/CloudSync';
import { Link as RouterLink } from 'react-router-dom';
import { useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button, Card } from '../../components/shared/ui';
import { StatsCard } from '../../components/shared/StatsCard';

export const ProfilePage = () => {
  const { user, loading, logout } = useAuth();

  const fields = useMemo(
    () => [
      { label: "Nom d'utilisateur", value: user?.username ?? 'N/A' },
      { label: 'Email', value: user?.email ?? 'N/A' },
      { label: 'Prénom', value: user?.first_name ?? 'N/A' },
      { label: 'Nom', value: user?.last_name ?? 'N/A' },
    ],
    [user?.email, user?.first_name, user?.last_name, user?.username],
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return null;
  }

  const displayName = user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : user.username;
  const initials = user.first_name?.[0] ?? user.username?.[0] ?? 'U';
  const completedFields = fields.filter((field) => field.value !== 'N/A').length;
  const missingFields = fields.length - completedFields;
  const profileCompletion = Math.round((completedFields / fields.length) * 100);
  const ldapEntries = user.ldap_info ? Object.entries(user.ldap_info) : [];

  const handleScrollToAccount = () => {
    document.getElementById('account-information')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const formatLdapKey = (key: string) => key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');

  return (
    <Stack spacing={{ xs: 3, md: 4 }} component="section">
      <Box>
        <Breadcrumbs
          aria-label="Fil d'Ariane"
          separator={<NavigateNextIcon fontSize="small" sx={{ color: 'text.disabled' }} />}
          sx={{ mb: 2 }}
        >
          <Link
            component={RouterLink}
            to="/"
            underline="hover"
            sx={{
              color: 'text.secondary',
              fontSize: '14px',
              fontWeight: 500,
              '&:hover': { color: 'primary.main' },
            }}
          >
            Accueil
          </Link>
          <Typography sx={{ fontSize: '14px', fontWeight: 500, color: 'text.primary' }}>
            Mon profil
          </Typography>
        </Breadcrumbs>
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: '28px', md: '32px' },
            fontWeight: 700,
            mb: 1,
            letterSpacing: '-0.5px',
          }}
        >
          Bonjour, {displayName}
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ fontSize: '15px', lineHeight: 1.6, maxWidth: '800px' }}
        >
          Gérez votre identité numérique et assurez-vous que vos informations sont à jour pour accéder à l'ensemble des services ARH.
        </Typography>
      </Box>

      {missingFields > 0 && (
        <Alert
          severity="info"
          sx={{
            borderRadius: '12px',
            border: '1px solid',
            borderColor: 'info.light',
            bgcolor: 'info.50',
            '& .MuiAlert-icon': { fontSize: '22px' },
            fontSize: '14px',
            fontWeight: 500,
          }}
        >
          Il reste {missingFields} champ{missingFields > 1 ? 's' : ''} à renseigner pour compléter votre profil.
        </Alert>
      )}

      <Grid container spacing={{ xs: .5, md: 1 }} alignItems="stretch">
        <Grid item xs={12} lg={4}>
          <Card
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)',
              border: '2px solid',
              borderColor: 'primary.100',
            }}
          >
            <Stack spacing={3}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar
                  sx={{
                    bgcolor: 'primary.main',
                    width: 72,
                    height: 72,
                    fontSize: '28px',
                    fontWeight: 700,
                    boxShadow: '0 4px 12px rgba(33, 150, 243, 0.25)',
                  }}
                >
                  {initials.toUpperCase()}
                </Avatar>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    variant="h2"
                    sx={{
                      fontSize: '20px',
                      fontWeight: 700,
                      mb: 0.5,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {displayName}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'text.secondary',
                      fontSize: '13px',
                      fontWeight: 500,
                    }}
                  >
                    @{user.username ?? 'utilisateur'}
                  </Typography>
                </Box>
              </Stack>

              <Stack spacing={1.5}>
                <Button
                  variant="contained"
                  startIcon={<ManageAccountsIcon />}
                  fullWidth
                  size="large"
                  onClick={handleScrollToAccount}
                  sx={{ fontWeight: 600 }}
                >
                  Mettre à jour
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<LogoutIcon />}
                  fullWidth
                  onClick={logout}
                  sx={{
                    fontWeight: 600,
                    borderColor: 'divider',
                    color: 'text.secondary',
                    '&:hover': {
                      borderColor: 'error.main',
                      color: 'error.main',
                      bgcolor: 'error.50',
                    },
                  }}
                >
                  Se déconnecter
                </Button>
              </Stack>
            </Stack>
          </Card>
        </Grid>

        <Grid item xs={12} lg={8}>
          <Card
            component="section"
            id="account-information"
            tabIndex={-1}
            sx={{
              outline: 'none',
              height: '100%',
            }}
          >
            <Typography
              variant="h2"
              sx={{
                fontSize: '18px',
                fontWeight: 700,
                mb: 3,
                pb: 2,
                borderBottom: '2px solid',
                borderColor: 'divider',
              }}
            >
              Informations du compte
            </Typography>
            <Grid container spacing={3}>
              {fields.map(({ label, value }) => (
                <Grid item xs={12} sm={6} key={label}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: '8px',
                      bgcolor: 'background.default',
                      border: '1px solid',
                      borderColor: value === 'N/A' ? 'error.100' : 'divider',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        borderColor: value === 'N/A' ? 'error.main' : 'primary.main',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                      },
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        textTransform: 'uppercase',
                        letterSpacing: 0.8,
                        fontWeight: 700,
                        fontSize: '11px',
                        color: 'text.secondary',
                        display: 'block',
                        mb: 1,
                      }}
                    >
                      {label}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 600,
                        fontSize: '15px',
                        color: value === 'N/A' ? 'error.main' : 'text.primary',
                      }}
                    >
                      {value}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <StatsCard
            label="Complétion du profil"
            value={`${profileCompletion}%`}
            helperText={`${completedFields}/${fields.length} champs remplis`}
            trendLabel={missingFields ? `${missingFields} à renseigner` : 'À jour'}
            trend={missingFields ? 'down' : 'up'}
            icon={<CheckCircleOutlineIcon />}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatsCard
            label="Champs manquants"
            value={missingFields}
            helperText="Priorisez les informations critiques"
            trendLabel={missingFields ? 'Action requise' : 'Complet'}
            trend={missingFields ? 'down' : 'up'}
            icon={<ErrorOutlineIcon />}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatsCard
            label="Champs LDAP suivis"
            value={ldapEntries.length}
            helperText="Synchronisés avec l'annuaire"
            trendLabel={ldapEntries.length ? 'Synchronisé' : 'Aucun flux'}
            trend={ldapEntries.length ? 'up' : 'neutral'}
            icon={<CloudSyncIcon />}
          />
        </Grid>

        {ldapEntries.length > 0 && (
          <Grid item xs={12}>
            <Card component="section">
              <Typography
                variant="h2"
                sx={{
                  fontSize: '18px',
                  fontWeight: 700,
                  mb: 3,
                  pb: 2,
                  borderBottom: '2px solid',
                  borderColor: 'divider',
                }}
              >
                Informations LDAP
              </Typography>
              <Grid container spacing={2}>
                {ldapEntries.map(([key, value]) => (
                  <Grid item xs={12} sm={6} md={4} key={key}>
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: '8px',
                        bgcolor: 'background.default',
                        border: '1px solid',
                        borderColor: 'divider',
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          textTransform: 'uppercase',
                          letterSpacing: 0.8,
                          fontWeight: 700,
                          fontSize: '11px',
                          color: 'text.secondary',
                          display: 'block',
                          mb: 1,
                        }}
                      >
                        {formatLdapKey(key)}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: 500,
                          fontSize: '14px',
                        }}
                      >
                        {value || 'N/A'}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Card>
          </Grid>
        )}
      </Grid>
      
    </Stack>
  );
};

export default ProfilePage;
