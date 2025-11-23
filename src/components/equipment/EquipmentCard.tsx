import { Avatar, Box, Card, CardActionArea, CardContent, Stack, Typography } from '@mui/material';
import DevicesIcon from '@mui/icons-material/Devices';
import type { ReactNode } from 'react';
import type { Equipment } from '../../types/equipment';
import { StatusChip } from '../shared/StatusChip';

interface EquipmentCardProps {
  equipment: Equipment;
  onSelect?: (equipment: Equipment) => void;
  actions?: ReactNode;
}

export const EquipmentCard = ({ equipment, onSelect, actions }: EquipmentCardProps) => {
  const content = (
    <CardContent>
      <Stack direction="row" spacing={2} alignItems="flex-start">
        <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>
          <DevicesIcon />
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6">{equipment.nom}</Typography>
          <Typography variant="body2" color="text.secondary">
            {equipment.projet_nom}
          </Typography>
          <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
            <StatusChip status={equipment.statut} />
            <StatusChip status={equipment.etat} variant="outlined" />
          </Stack>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
            {equipment.localisation || 'Localisation inconnue'}
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            {equipment.nombre_dossiers} dossier{equipment.nombre_dossiers > 1 ? 's' : ''}
          </Typography>
        </Box>
        {actions}
      </Stack>
    </CardContent>
  );

  return (
    <Card>
      {onSelect ? (
        <CardActionArea onClick={() => onSelect(equipment)}>{content}</CardActionArea>
      ) : (
        content
      )}
    </Card>
  );
};
