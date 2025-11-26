import { Box, Divider, Stack, Step, StepLabel, Stepper, Typography } from '@mui/material';
import type { ReactNode } from 'react';
import type { EquipmentStatus } from '../../types/equipment';

interface EquipmentStatusRailProps {
  status: EquipmentStatus;
  steps?: EquipmentStatus[];
  subtitle?: string;
  actions?: ReactNode;
}

const DEFAULT_STEPS: EquipmentStatus[] = ['En attente', 'En cours', 'Validé'];

export const EquipmentStatusRail = ({
  status,
  steps = DEFAULT_STEPS,
  subtitle,
  actions,
}: EquipmentStatusRailProps) => {
  const activeStep = Math.max(
    0,
    steps.findIndex((step) => step.toLowerCase() === status.toLowerCase()),
  );

  return (
    <Box
      sx={{
        p: 3,
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'background.paper',
        boxShadow: 'sm',
      }}
    >
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'center' }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" color="text.primary" sx={{ fontSize: '1rem', fontWeight: 600, mb: 0.5 }}>
            État d'avancement
          </Typography>
          {subtitle && (
            <Typography variant="body1" color="text.secondary" sx={{ fontSize: '0.8125rem', mb: 2 }}>
              {subtitle}
            </Typography>
          )}
          <Stepper
            alternativeLabel
            activeStep={activeStep === -1 ? 0 : activeStep}
            sx={{
              mt: 1.5,
              '& .MuiStepLabel-label': {
                fontSize: '0.875rem',
                fontWeight: 500,
                mt: 1,
              },
              '& .MuiStepIcon-root': {
                fontSize: '1.5rem',
              },
            }}
          >
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>
        {actions && (
          <>
            <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' } }} />
            <Box>{actions}</Box>
          </>
        )}
      </Stack>
    </Box>
  );
};
