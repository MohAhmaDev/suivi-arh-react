import { Alert, Box, Stack, Typography } from '@mui/material';
import { useDashboardStats } from '../../hooks/queries/useDashboardStats';
import { LoadingState } from '../../components/feedback/LoadingState';
import { ErrorState } from '../../components/feedback/ErrorState';
import { StatsGrid } from '../../components/dashboard/StatsGrid';
import { ActivityFeed } from '../../components/dashboard/ActivityFeed';
import { QuickActions } from '../../components/dashboard/QuickActions';

export const DashboardPage = () => {
  const { stats, recentActivity, loading, error, refetch } = useDashboardStats();

  if (loading && !stats) {
    return <LoadingState message="Chargement du tableau de bord..." />;
  }

  if (error && !stats) {
    return <ErrorState error={error} onRetry={refetch} />;
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Stack spacing={1}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Tableau de bord
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Vue consolidée des projets, équipements, dossiers et courriers en temps réel.
        </Typography>
      </Stack>

      {error && (
        <Alert severity="warning" onClose={refetch} sx={{ borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {stats && (
        <Stack spacing={3}>
          <StatsGrid stats={stats} />
          <Box
            sx={{
              display: 'grid',
              gap: 3,
              gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' },
            }}
          >
            <ActivityFeed activities={recentActivity} loading={loading} />
            <QuickActions />
          </Box>
        </Stack>
      )}
    </Box>
  );
};

export default DashboardPage;
