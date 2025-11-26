import type { BadgeTone, BadgeProps } from './ui';
import { Badge } from './ui';

interface StatusChipProps extends Omit<BadgeProps, 'tone' | 'children'> {
  status: string;
}

const resolveTone = (status: string): BadgeTone => {
  const normalized = status.toLowerCase();
  if (normalized.includes('validé') || normalized.includes('terminé') || normalized.includes('service')) {
    return 'success';
  }
  if (normalized.includes('rejet') || normalized.includes('hors service') || normalized.includes('panne')) {
    return 'error';
  }
  if (normalized.includes('cours') || normalized.includes('attente') || normalized.includes('préparation')) {
    return 'warning';
  }
  if (normalized.includes('info') || normalized.includes('prévention')) {
    return 'info';
  }
  return 'neutral';
};

export const StatusChip = ({ status, ...props }: StatusChipProps) => (
  <Badge tone={resolveTone(status)} size="small" {...props}>
    {status}
  </Badge>
);
