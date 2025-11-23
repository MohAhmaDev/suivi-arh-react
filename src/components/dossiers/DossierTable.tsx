import {
  Box,
  Checkbox,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Tooltip,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/CheckCircleOutline';
import CloseIcon from '@mui/icons-material/HighlightOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import type { Dossier } from '../../types/dossier';
import { StatusChip } from '../shared/StatusChip';

const formatDate = (value?: string | null) =>
  value ? new Date(value).toLocaleDateString('fr-FR') : '—';

type SortKey = 'type_dossier' | 'statut' | 'date_creation' | 'nombre_courriers';

type SortDirection = 'asc' | 'desc';

interface DossierTableProps {
  dossiers: Dossier[];
  sortBy?: SortKey;
  sortDirection?: SortDirection;
  onSortChange?: (key: SortKey, direction: SortDirection) => void;
  onView?: (dossier: Dossier) => void;
  onValidate?: (dossier: Dossier) => void;
  onReject?: (dossier: Dossier) => void;
  selectable?: boolean;
  selectedIds?: Set<number>;
  onToggleSelect?: (dossier: Dossier) => void;
  onToggleSelectAll?: (checked: boolean) => void;
}

const nextDirection = (direction: SortDirection): SortDirection => (direction === 'asc' ? 'desc' : 'asc');

export const DossierTable = ({
  dossiers,
  sortBy = 'date_creation',
  sortDirection = 'desc',
  onSortChange,
  onView,
  onValidate,
  onReject,
  selectable = false,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
}: DossierTableProps) => {
  const handleSort = (key: SortKey) => {
    if (!onSortChange) return;
    const newDirection = key === sortBy ? nextDirection(sortDirection) : 'asc';
    onSortChange(key, newDirection);
  };

  const sortedDossiers = [...dossiers].sort((a, b) => {
    const directionFactor = sortDirection === 'asc' ? 1 : -1;
    if (sortBy === 'nombre_courriers') {
      return (a.nombre_courriers - b.nombre_courriers) * directionFactor;
    }
    if (sortBy === 'date_creation') {
      return (
        (a.date_creation ? new Date(a.date_creation).getTime() : 0) -
        (b.date_creation ? new Date(b.date_creation).getTime() : 0)
      ) * directionFactor;
    }
    return a[sortBy].localeCompare(b[sortBy]) * directionFactor;
  });

  const allSelected =
    selectable && selectedIds && dossiers.length > 0
      ? dossiers.every((dossier) => selectedIds.has(dossier.id))
      : false;

  const someSelected = selectable && selectedIds && selectedIds.size > 0 && !allSelected;

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {selectable && (
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={Boolean(someSelected)}
                  checked={Boolean(selectable && allSelected)}
                  onChange={(event) => onToggleSelectAll?.(event.target.checked)}
                />
              </TableCell>
            )}
            <TableCell>
              <TableSortLabel
                active={sortBy === 'type_dossier'}
                direction={sortBy === 'type_dossier' ? sortDirection : 'asc'}
                onClick={() => handleSort('type_dossier')}
              >
                Type
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={sortBy === 'statut'}
                direction={sortBy === 'statut' ? sortDirection : 'asc'}
                onClick={() => handleSort('statut')}
              >
                Statut
              </TableSortLabel>
            </TableCell>
            <TableCell>Projet</TableCell>
            <TableCell>
              <TableSortLabel
                active={sortBy === 'date_creation'}
                direction={sortBy === 'date_creation' ? sortDirection : 'desc'}
                onClick={() => handleSort('date_creation')}
              >
                Créé le
              </TableSortLabel>
            </TableCell>
            <TableCell align="right">
              <TableSortLabel
                active={sortBy === 'nombre_courriers'}
                direction={sortBy === 'nombre_courriers' ? sortDirection : 'desc'}
                onClick={() => handleSort('nombre_courriers')}
              >
                Courriers
              </TableSortLabel>
            </TableCell>
            {(onView || onValidate || onReject) && <TableCell align="right">Actions</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedDossiers.map((dossier) => (
            <TableRow key={dossier.id} hover>
              {selectable && (
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedIds?.has(dossier.id) ?? false}
                    onChange={() => onToggleSelect?.(dossier)}
                  />
                </TableCell>
              )}
              <TableCell>{dossier.type_dossier}</TableCell>
              <TableCell>
                <StatusChip status={dossier.statut} />
              </TableCell>
              <TableCell>{dossier.equipement_projet}</TableCell>
              <TableCell>{formatDate(dossier.date_creation)}</TableCell>
              <TableCell align="right">{dossier.nombre_courriers}</TableCell>
              {(onView || onValidate || onReject) && (
                <TableCell align="right">
                  <Box sx={{ display: 'inline-flex', gap: 1 }}>
                    {onView && (
                      <Tooltip title="Consulter">
                        <IconButton size="small" onClick={() => onView(dossier)}>
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                    {onValidate && (
                      <Tooltip title="Valider">
                        <IconButton size="small" color="success" onClick={() => onValidate(dossier)}>
                          <CheckIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                    {onReject && (
                      <Tooltip title="Rejeter">
                        <IconButton size="small" color="error" onClick={() => onReject(dossier)}>
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
