import React from 'react';
import { Box, Drawer, AppBar, Toolbar, Typography, List, ListItem, ListItemIcon, ListItemText, CssBaseline } from '@mui/material';
import { Dashboard, Inventory, ShoppingCart, Assessment, Store } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const drawerWidth = 260;
const menuItems = [
  { text: 'Dashboard', icon: <Dashboard />, path: '/' },
  { text: 'Products', icon: <Store />, path: '/products' },
  { text: 'Orders', icon: <ShoppingCart />, path: '/orders' },
  { text: 'Inventory', icon: <Inventory />, path: '/inventory' },
  { text: 'Analytics', icon: <Assessment />, path: '/analytics' },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px`, bgcolor: '#1e3a8a' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>NEXORA AI VENDOR PORTAL</Typography>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" sx={{ width: drawerWidth, flexShrink: 0, '& .MuiDrawer-paper': { width: drawerWidth } }}>
        <Toolbar sx={{ bgcolor: '#1e3a8a', color: 'white', justifyContent: 'center' }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>NEXORA</Typography>
        </Toolbar>
        <List>
          {menuItems.map((item) => (
            <ListItem button key={item.text} onClick={() => navigate(item.path)} selected={location.pathname === item.path}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, bgcolor: '#f3f4f6', p: 3, mt: 8, minHeight: '100vh' }}>{children}</Box>
    </Box>
  );
}
