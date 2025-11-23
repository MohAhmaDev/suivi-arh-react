import { Box, Button, Paper, Stack, Typography } from '@mui/material';
import type { ButtonProps } from '@mui/material';
import type { ReactNode } from 'react';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  actionProps?: ButtonProps;
}

export const EmptyState = ({
  title,
  description,
  icon,
  actionLabel,
  onAction,
  actionProps,
}: EmptyStateProps) => (
  <Paper sx={{ p: 4, textAlign: 'center' }}>
    <Stack spacing={2} alignItems="center" justifyContent="center">
      {icon}
      <Box>
        <Typography variant="h6">{title}</Typography>
        {description && (
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        )}
      </Box>
      {actionLabel && (
        <Button variant="contained" onClick={onAction} {...actionProps}>
          {actionLabel}
        </Button>
      )}
    </Stack>
  </Paper>
);
