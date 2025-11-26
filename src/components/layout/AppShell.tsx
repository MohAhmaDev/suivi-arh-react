import { useState, type ReactNode } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  Box,
  useTheme,
  useMediaQuery,
  Stack,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Sidebar from './Sidebar';
import { Breadcrumbs } from './Breadcrumbs';

const drawerWidth = 240;
const toolbarHeight = 64;

interface AppShellProps {
  children: ReactNode;
}

export const AppShell = ({ children }: AppShellProps) => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          zIndex: (t) => t.zIndex.drawer + 1,
          borderBottom: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        <Toolbar sx={{ minHeight: toolbarHeight, px: { xs: 2, md: 3 }, gap: 2 }}>
          {!isDesktop && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 1 }}
              aria-label="Ouvrir la navigation"
            >
              <MenuIcon />
            </IconButton>
          )}
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: '8px',
                bgcolor: 'primary.main',
              }}
            />
            <Box>
              <Typography variant="h4" sx={{ fontSize: '18px' }}>
                Suivi ARH
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Ministère de la Santé
              </Typography>
            </Box>
          </Stack>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              top: toolbarHeight,
              height: `calc(100vh - ${toolbarHeight}px)`,
            },
          }}
        >
          <Sidebar onNavigate={handleDrawerToggle} />
        </Drawer>
        <Drawer
          variant="permanent"
          open
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              top: toolbarHeight,
              height: `calc(100vh - ${toolbarHeight}px)`,
              borderRight: '1px solid',
              borderColor: 'divider',
            },
          }}
        >
          <Sidebar />
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          px: { xs: 2, md: 3, lg: 4 },
          py: { xs: 2, md: 3 },
          mt: `${toolbarHeight}px`,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          minHeight: `calc(100vh - ${toolbarHeight}px)`,
          overflow: 'auto',
          position: 'relative',
        }}
      >
        <Breadcrumbs />
        {children}
      </Box>
    </Box>
  );
};

export default AppShell;
