import { useCallback, useEffect, useState } from 'react';
import { statsService } from '../../services/statsService';
import type { DashboardStats, RecentActivity } from '../../types/stats';

interface UseDashboardStatsOptions {
  activityLimit?: number;
}

export const useDashboardStats = (options?: UseDashboardStatsOptions) => {
  const { activityLimit = 15 } = options ?? {};
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reloadIndex, setReloadIndex] = useState(0);

  const refetch = useCallback(() => setReloadIndex((prev) => prev + 1), []);

  useEffect(() => {
    let ignore = false;

    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [statsData, activityData] = await Promise.all([
          statsService.getDashboardStats(),
          statsService.getRecentActivity(activityLimit),
        ]);
        if (!ignore) {
          setStats(statsData);
          setRecentActivity(activityData);
        }
      } catch (err) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchDashboardData();
    return () => {
      ignore = true;
    };
  }, [activityLimit, reloadIndex]);

  useEffect(() => {
    const handleFocus = () => refetch();
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [refetch]);

  return { stats, recentActivity, loading, error, refetch };
};
