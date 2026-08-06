import React from 'react';
import { Box, Drawer, AppBar, Toolbar, Typography, List, ListItem, ListItemIcon, ListItemText, CssBaseline } from '@mui/material';
import { Dashboard, People, Store, ShoppingCart, Inventory, Analytics, Support } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const drawerWidth = 260;

const menuItems = [
  { text: 'Dashboard', icon: <Dashboard />, path: '/' },
  { text: 'Users', icon: <People />, path: '/users' },
  { text: 'Vendors', icon: <Store />, path: '/vendors' },
  { text: 'Orders', icon: <ShoppingCart />, path: '/orders' },
  { text: 'Products', icon: <Inventory />, path: '/products' },
  { text: 'Analytics', icon: <Analytics />, path: '/analytics' },
  { text: 'Support', icon: <Support />, path: '/support' },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px`, bgcolor: '#1e3a8a' }}>
        <Toolbar>
          <Typography variant="h6" noWrap sx={{ fontWeight: 'bold' }}>NEXORA AI ADMIN</Typography>
          <Typography variant="caption" sx={{ ml: 2, opacity: 0.8 }}>Powering Local Commerce with AI</Typography>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" sx={{ width: drawerWidth, flexShrink: 0, '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' } }}>
        <Toolbar sx={{ bgcolor: '#1e3a8a', color: 'white', justifyContent: 'center' }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', letterSpacing: 2 }}>NEXORA</Typography>
        </Toolbar>
        <List>
          {menuItems.map((item) => (
            <ListItem 
              button 
              key={item.text} 
              onClick={() => navigate(item.path)}
              selected={location.pathname === item.path}
              sx={{ '&.Mui-selected': { bgcolor: '#fff7ed', borderRight: '3px solid #f97316' } }}
            >
              <ListItemIcon sx={{ color: location.pathname === item.path ? '#f97316' : 'inherit' }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, bgcolor: '#f3f4f6', p: 3, mt: 8, minHeight: '100vh' }}>
        {children}
      </Box>
    </Box>
  );
}
