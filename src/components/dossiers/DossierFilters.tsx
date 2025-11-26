import { IconButton, MenuItem, Stack, TextField, Tooltip } from '@mui/material';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import type { DossierFilters as DossierFiltersModel, DossierStatus, DossierType } from '../../types/dossier';

interface DossierFiltersProps {
  value: DossierFiltersModel;
  onChange: (filters: DossierFiltersModel) => void;
}

const STATUS_OPTIONS: DossierStatus[] = ['En cours', 'Validé', 'Concluant', 'Non concluant', 'Refusé'];
const TYPE_OPTIONS: DossierType[] = ['Préliminaire', 'Essai usine', 'Essai site', 'Procédure essai', 'HSE', 'Final'];

export const DossierFilters = ({ value, onChange }: DossierFiltersProps) => {
  const handleChange = <K extends keyof DossierFiltersModel,>(
    key: K,
    val: DossierFiltersModel[K] | '',
  ) => {
    onChange({
      ...value,
      [key]: val === '' || val === undefined ? undefined : val,
    });
  };

  const handleReset = () => onChange({});

  return (
    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ xs: 'stretch', md: 'flex-end' }}>
      <TextField
        select
        label="Statut"
        value={value.statut ?? ''}
        onChange={(event) => handleChange('statut', event.target.value as DossierStatus)}
        sx={{ minWidth: 200 }}
        size="small"
      >
        <MenuItem value="">
          Tous
        </MenuItem>
        {STATUS_OPTIONS.map((status) => (
          <MenuItem key={status} value={status}>
            {status}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        select
        label="Type"
        value={value.type_dossier ?? ''}
        onChange={(event) => handleChange('type_dossier', event.target.value as DossierType)}
        sx={{ minWidth: 200 }}
        size="small"
      >
        <MenuItem value="">
          Tous
        </MenuItem>
        {TYPE_OPTIONS.map((type) => (
          <MenuItem key={type} value={type}>
            {type}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        label="ID équipement"
        type="number"
        value={value.equipement ?? ''}
        onChange={(event) => handleChange('equipement', event.target.value ? Number(event.target.value) : undefined)}
        sx={{ minWidth: 200 }}
        size="small"
        placeholder="Facultatif"
      />

      <Tooltip title="Réinitialiser les filtres">
        <span>
          <IconButton onClick={handleReset} disabled={!value.statut && !value.type_dossier && !value.equipement}>
            <FilterAltOffIcon />
          </IconButton>
        </span>
      </Tooltip>
    </Stack>
  );
};

export default DossierFilters;
