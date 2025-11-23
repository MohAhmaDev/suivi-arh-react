import {
  Box,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import WorkspacesIcon from '@mui/icons-material/Workspaces';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import { NavLink } from 'react-router-dom';
import type { ReactNode } from 'react';

interface SidebarProps {
  onNavigate?: () => void;
}

interface NavItem {
  label: string;
  to: string;
  icon: ReactNode;
  end?: boolean;
}

const navItems: NavItem[] = [
  {
    label: 'Tableau de bord',
    to: '/',
    icon: <DashboardIcon fontSize="small" />,
    end: true,
  },
  {
    label: 'Projets',
    to: '/projects',
    icon: <WorkspacesIcon fontSize="small" />,
  },
  {
    label: 'Équipements',
    to: '/equipment',
    icon: <PrecisionManufacturingIcon fontSize="small" />,
  },
  {
    label: 'Dossiers & Courriers',
    to: '/dossiers',
    icon: <MailOutlineIcon fontSize="small" />,
  },
];

const NavListItem = ({
  label,
  to,
  icon,
  end,
  onNavigate,
}: NavItem & { onNavigate?: () => void }) => (
  <ListItemButton
    component={NavLink}
    to={to}
    end={end}
    onClick={onNavigate}
    sx={{
      borderRadius: 1,
      mb: 0.5,
      '&.active': {
        bgcolor: 'primary.main',
        color: 'primary.contrastText',
        '& .MuiListItemIcon-root': {
          color: 'primary.contrastText',
        },
      },
    }}
  >
    <ListItemIcon sx={{ minWidth: 36 }}>{icon}</ListItemIcon>
    <ListItemText primary={label} primaryTypographyProps={{ fontSize: 14 }} />
  </ListItemButton>
);

export const Sidebar = ({ onNavigate }: SidebarProps) => (
  <Box sx={{ width: 240, display: 'flex', flexDirection: 'column', height: '100%' }}>
    <Box sx={{ p: 2 }}>
      <Typography variant="h6">Suivi ARH</Typography>
      <Typography variant="body2" color="text.secondary">
        Ministère de la Santé
      </Typography>
    </Box>
    <Divider />
    <Box sx={{ p: 2, flexGrow: 1 }}>
      <List sx={{ p: 0 }}>
        {navItems.map((item) => (
          <NavListItem key={item.to} {...item} onNavigate={onNavigate} />
        ))}
      </List>
    </Box>
  </Box>
);

export default Sidebar;
