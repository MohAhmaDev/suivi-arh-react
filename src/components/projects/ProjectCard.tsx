import { Card, CardContent, Typography, Chip, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import type { Project } from '../../types/project';

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard = ({ project }: ProjectCardProps) => {
  const navigate = useNavigate();

  return (
    <Card
      onClick={() => navigate(`/projects/${project.id}`)}
      sx={{
        cursor: 'pointer',
        transition: 'all 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 3,
        },
      }}
    >
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {project.nom}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {project.region_nom} ({project.region_code})
        </Typography>
        <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip label={project.etat} size="small" color="primary" />
          <Chip label={`${project.nombre_equipements} équipements`} size="small" variant="outlined" />
        </Box>
        {project.description && (
          <Typography variant="body2" sx={{ mt: 1 }} noWrap>
            {project.description}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};
