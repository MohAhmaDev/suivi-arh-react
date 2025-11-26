import { Box, Stack, Typography } from '@mui/material';
import type { ReactNode } from 'react';
import { Card } from './ui';

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
  <Card
    sx={{
      height: '100%',
      position: 'relative',
      overflow: 'hidden',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        bgcolor: trend === 'up' ? 'success.main' : trend === 'down' ? 'error.main' : 'primary.main',
      },
    }}
  >
    <Stack spacing={2}>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
        <Typography
          variant="body2"
          sx={{
            textTransform: 'uppercase',
            letterSpacing: 0.8,
            fontWeight: 700,
            fontSize: '11px',
            color: 'text.secondary',
          }}
        >
          {label}
        </Typography>
        {icon && (
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '8px',
              bgcolor: 'primary.50',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'primary.main',
            }}
          >
            {icon}
          </Box>
        )}
      </Stack>

      <Typography
        variant="h3"
        sx={{
          fontSize: '32px',
          fontWeight: 700,
          letterSpacing: '-0.5px',
          lineHeight: 1,
        }}
      >
        {value}
      </Typography>

      {helperText && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            fontSize: '13px',
            lineHeight: 1.4,
          }}
        >
          {helperText}
        </Typography>
      )}

      {trendLabel && (
        <Stack
          direction="row"
          spacing={0.5}
          alignItems="center"
          sx={{
            px: 1.5,
            py: 0.75,
            bgcolor:
              trend === 'up'
                ? 'success.50'
                : trend === 'down'
                  ? 'error.50'
                  : 'background.default',
            borderRadius: '6px',
            width: 'fit-content',
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: trendColorMap[trend],
              fontWeight: 600,
              fontSize: '12px',
            }}
          >
            {trendLabel}
          </Typography>
        </Stack>
      )}
    </Stack>
  </Card>
);
