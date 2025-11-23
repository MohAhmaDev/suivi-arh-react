import { Chip } from '@mui/material';
import type { ChipProps } from '@mui/material';

interface StatusChipProps extends Omit<ChipProps, 'color'> {
  status: string;
}

export const StatusChip = ({ status, ...props }: StatusChipProps) => {
  const getStatusColor = (status: string): ChipProps['color'] => {
    const lowerStatus = status.toLowerCase();
    
    if (lowerStatus.includes('validé') || lowerStatus.includes('terminé') || lowerStatus.includes('en service')) {
      return 'success';
    }
    if (lowerStatus.includes('rejeté') || lowerStatus.includes('hors service') || lowerStatus.includes('panne')) {
      return 'error';
    }
    if (lowerStatus.includes('en cours') || lowerStatus.includes('en attente')) {
      return 'warning';
    }
    if (lowerStatus.includes('préparation')) {
      return 'info';
    }
    
    return 'default';
  };

  return (
    <Chip
      label={status}
      color={getStatusColor(status)}
      size="small"
      {...props}
    />
  );
};
