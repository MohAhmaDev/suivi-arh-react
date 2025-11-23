import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  CssBaseline,
  Divider,
  Paper,
  Typography,
} from '@mui/material';
import Fade from '@mui/material/Fade';
import GlobalStyles from '@mui/material/GlobalStyles';
import { Logout as LogoutIcon } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

export const DashboardPage = () => {
  const { user, loading, logout } = useAuth();

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

  return (
    <>
      <CssBaseline />
      <GlobalStyles
        styles={{
          'html, body, #root': {
            height: '100%',
            margin: 0,
            padding: 0,
            overflow: 'hidden',
          },
        }}
      />

      <Box
        sx={{
          position: 'fixed',
          inset: 0,
          background: 'linear-gradient(135deg, #3b82f6 0%, #14b8a6 100%)',
          filter: 'blur(80px)',
          transform: 'scale(1.2)',
          zIndex: 0,
        }}
      />

      <Box
        sx={{
          position: 'relative',
          height: '100dvh',
          width: '100vw',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2,
          zIndex: 1,
        }}
      >
        <Fade in timeout={600}>
          <Paper
            elevation={0}
            sx={{
              width: '100%',
              maxWidth: 700,
              p: { xs: 3, sm: 4 },
              borderRadius: 4,
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(16px)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
              overflowY: 'auto',
              maxHeight: '90dvh',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar
                  sx={{
                    bgcolor: 'primary.main',
                    width: 56,
                    height: 56,
                  }}
                >
                  {initials.toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="h5" fontWeight={600}>
                    {displayName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    @{user.username ?? 'unknown'}
                  </Typography>
                </Box>
              </Box>
              <Button
                onClick={logout}
                variant="contained"
                color="primary"
                startIcon={<LogoutIcon />}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 500,
                }}
              >
                Logout
              </Button>
            </Box>

            <Divider sx={{ mb: 3 }} />
            <Typography variant="h6" sx={{ mb: 2 }}>
              Account Information
            </Typography>

            <Box
              sx={{
                display: 'grid',
                gap: 2,
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' },
                mb: 3,
              }}
            >
              {[
                { label: 'Username', value: user.username ?? 'N/A' },
                { label: 'Email', value: user.email ?? 'N/A' },
                { label: 'First Name', value: user.first_name ?? 'N/A' },
                { label: 'Last Name', value: user.last_name ?? 'N/A' },
              ].map(({ label, value }) => (
                <Box key={label}>
                  <Typography variant="body2" color="text.secondary">
                    {label}
                  </Typography>
                  <Typography variant="body1">{value}</Typography>
                </Box>
              ))}
            </Box>

            {user.ldap_info && Object.keys(user.ldap_info).length > 0 && (
              <>
                <Divider sx={{ mb: 3 }} />
                <Typography variant="h6" sx={{ mb: 2 }}>
                  LDAP Information
                </Typography>

                <Box
                  sx={{
                    display: 'grid',
                    gap: 2,
                    gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' },
                  }}
                >
                  {Object.entries(user.ldap_info).map(([key, value]) => (
                    <Box key={key}>
                      <Typography variant="body2" color="text.secondary">
                        {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                      </Typography>
                      <Typography variant="body1">{value || 'N/A'}</Typography>
                    </Box>
                  ))}
                </Box>
              </>
            )}
          </Paper>
        </Fade>
      </Box>
    </>
  );
};

export default DashboardPage;
