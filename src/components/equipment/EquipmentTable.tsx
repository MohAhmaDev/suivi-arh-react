import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from '@mui/material';
import type { Equipment } from '../../types/equipment';

interface EquipmentTableProps {
  equipment: Equipment[];
}

export const EquipmentTable = ({ equipment }: EquipmentTableProps) => {
  if (equipment.length === 0) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        Aucun équipement trouvé
      </Paper>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nom</TableCell>
            <TableCell>Localisation</TableCell>
            <TableCell>Référence</TableCell>
            <TableCell>Statut</TableCell>
            <TableCell>État</TableCell>
            <TableCell align="right">Dossiers</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {equipment.map((item) => (
            <TableRow key={item.id} hover>
              <TableCell>{item.nom}</TableCell>
              <TableCell>{item.localisation || '-'}</TableCell>
              <TableCell>{item.reference || '-'}</TableCell>
              <TableCell>
                <Chip label={item.statut} size="small" color="primary" />
              </TableCell>
              <TableCell>
                <Chip label={item.etat} size="small" variant="outlined" />
              </TableCell>
              <TableCell align="right">{item.nombre_dossiers}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
