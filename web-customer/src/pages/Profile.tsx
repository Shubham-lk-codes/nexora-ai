import React from 'react';
import { Typography, Paper, Box, Avatar, Button, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { LocationOn, Payment, Loyalty, Settings } from '@mui/icons-material';

export default function Profile() {
  return (
    <Box sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
      <Paper sx={{ p: 4, textAlign: 'center', mb: 3 }}>
        <Avatar sx={{ width: 100, height: 100, mx: 'auto', mb: 2, bgcolor: '#1e3a8a' }}>JD</Avatar>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>John Doe</Typography>
        <Typography color="textSecondary">john@nexora.ai</Typography>
        <Typography sx={{ color: '#f97316', fontWeight: 'bold', mt: 1 }}>Gold Member ⭐</Typography>
      </Paper>
      <Paper>
        <List>
          <ListItem button><ListItemIcon><LocationOn /></ListItemIcon><ListItemText primary="My Addresses" /></ListItem>
          <ListItem button><ListItemIcon><Payment /></ListItemIcon><ListItemText primary="Payment Methods" /></ListItem>
          <ListItem button><ListItemIcon><Loyalty /></ListItemIcon><ListItemText primary="Loyalty Points: 2,450" /></ListItem>
          <ListItem button><ListItemIcon><Settings /></ListItemIcon><ListItemText primary="Settings" /></ListItem>
        </List>
      </Paper>
    </Box>
  );
}
