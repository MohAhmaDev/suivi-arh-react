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
        p: 2,
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'background.paper',
      }}
    >
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'center' }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle2" color="text.secondary">
            État d'avancement
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          )}
          <Stepper alternativeLabel activeStep={activeStep === -1 ? 0 : activeStep} sx={{ mt: 2 }}>
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
