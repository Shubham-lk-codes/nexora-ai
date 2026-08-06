import React from 'react';
import { AppBar, Toolbar, Typography, Box, IconButton, Badge, Button } from '@mui/material';
import { ShoppingCart, Search, AccountCircle } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  return (
    <AppBar position="sticky" sx={{ bgcolor: '#1e3a8a' }}>
      <Toolbar>
        <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: 'bold', cursor: 'pointer' }} onClick={() => navigate('/')}>
          NEXORA AI
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton color="inherit"><Search /></IconButton>
          <IconButton color="inherit" onClick={() => navigate('/cart')}>
            <Badge badgeContent={2} color="secondary"><ShoppingCart /></Badge>
          </IconButton>
          <Button color="inherit" startIcon={<AccountCircle />} onClick={() => navigate('/profile')}>Profile</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
