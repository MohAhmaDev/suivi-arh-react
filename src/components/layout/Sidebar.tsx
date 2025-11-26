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
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
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

const SIDEBAR_WIDTH = 240;

const navItems: NavItem[] = [
  {
    label: 'Tableau de bord',
    to: '/',
    icon: <DashboardIcon fontSize="small" />,
    end: true,
  },
  {
    label: 'Mon profil',
    to: '/profile',
    icon: <ManageAccountsIcon fontSize="small" />,
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
      borderRadius: '8px',
      mb: 0.5,
      py: 1.25,
      px: 1.5,
      transition: 'all 0.2s ease',
      '&:hover': {
        bgcolor: 'action.hover',
        transform: 'translateX(2px)',
      },
      '&.active': {
        bgcolor: 'primary.50',
        color: 'primary.700',
        fontWeight: 600,
        '& .MuiListItemIcon-root': {
          color: 'primary.600',
        },
        '&:hover': {
          bgcolor: 'primary.100',
        },
      },
    }}
  >
    <ListItemIcon sx={{ minWidth: 40, color: 'text.secondary' }}>{icon}</ListItemIcon>
    <ListItemText
      primary={label}
      primaryTypographyProps={{
        fontSize: 14,
        fontWeight: 500,
        lineHeight: 1.4,
      }}
    />
  </ListItemButton>
);

export const Sidebar = ({ onNavigate }: SidebarProps) => (
  <Box
    sx={{
      width: SIDEBAR_WIDTH,
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      bgcolor: 'background.paper',
      overflow: 'hidden',
    }}
  >
    <Box sx={{ px: 2, pt: 2, pb: 1.5 }}>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{
          textTransform: 'uppercase',
          letterSpacing: 1,
          fontWeight: 600,
          fontSize: '11px',
          display: 'block',
          mb: 1,
        }}
      >
        Navigation
      </Typography>
    </Box>
    <Box sx={{ px: 2, flexGrow: 1, overflow: 'auto' }}>
      <List sx={{ p: 0 }}>
        {navItems.map((item) => (
          <NavListItem key={item.to} {...item} onNavigate={onNavigate} />
        ))}
      </List>
    </Box>
    <Divider />
    <Box
      sx={{
        px: 2,
        py: 1.5,
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        bgcolor: 'background.default',
      }}
    >
      <Box
        sx={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          bgcolor: 'success.main',
        }}
      />
      <Typography variant="caption" color="text.secondary" sx={{ fontSize: '12px' }}>
        Système actif
      </Typography>
    </Box>
  </Box>
);

export default Sidebar;
