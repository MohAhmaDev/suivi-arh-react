import { Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import type { ProjectState } from '../../types/project';
import type { Region } from '../../types/region';

interface ProjectFiltersProps {
  regions: Region[];
  selectedRegion?: number;
  selectedStatus?: ProjectState;
  onRegionChange: (regionId: number | undefined) => void;
  onStatusChange: (status: ProjectState | undefined) => void;
}

export const ProjectFilters = ({
  regions,
  selectedRegion,
  selectedStatus,
  onRegionChange,
  onStatusChange,
}: ProjectFiltersProps) => {
  const statusOptions: ProjectState[] = ['En préparation', 'En cours', 'Terminé'];

  return (
    <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
      <FormControl sx={{ minWidth: 200 }}>
        <InputLabel id="region-filter-label">Région</InputLabel>
        <Select
          labelId="region-filter-label"
          id="region-filter"
          value={selectedRegion || ''}
          label="Région"
          onChange={(e) => onRegionChange(e.target.value ? Number(e.target.value) : undefined)}
        >
          <MenuItem value="">
            <em>Toutes les régions</em>
          </MenuItem>
          {regions.map((region) => (
            <MenuItem key={region.id} value={region.id}>
              {region.nom} ({region.code})
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl sx={{ minWidth: 200 }}>
        <InputLabel id="status-filter-label">État</InputLabel>
        <Select
          labelId="status-filter-label"
          id="status-filter"
          value={selectedStatus || ''}
          label="État"
          onChange={(e) => onStatusChange(e.target.value as ProjectState || undefined)}
        >
          <MenuItem value="">
            <em>Tous les états</em>
          </MenuItem>
          {statusOptions.map((status) => (
            <MenuItem key={status} value={status}>
              {status}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};
