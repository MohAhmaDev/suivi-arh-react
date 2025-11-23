import { Box, Card, CardContent, Stack, Typography } from '@mui/material';
import type { ReactNode } from 'react';

type Trend = 'up' | 'down' | 'neutral';

interface StatsCardProps {
  label: string;
  value: string | number;
  helperText?: string;
  icon?: ReactNode;
  trendLabel?: string;
  trend?: Trend;
}

const trendColorMap: Record<Trend, string> = {
  up: 'success.main',
  down: 'error.main',
  neutral: 'text.secondary',
};

export const StatsCard = ({ label, value, helperText, icon, trendLabel, trend = 'neutral' }: StatsCardProps) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
        <Box>
          <Typography variant="subtitle2" color="text.secondary">
            {label}
          </Typography>
          <Typography variant="h4" sx={{ mt: 1 }}>
            {value}
          </Typography>
          {helperText && (
            <Typography variant="body2" color="text.secondary">
              {helperText}
            </Typography>
          )}
          {trendLabel && (
            <Typography variant="caption" sx={{ color: trendColorMap[trend], mt: 0.5, display: 'block' }}>
              {trendLabel}
            </Typography>
          )}
        </Box>
        {icon && <Box sx={{ color: 'primary.main' }}>{icon}</Box>}
      </Stack>
    </CardContent>
  </Card>
);
