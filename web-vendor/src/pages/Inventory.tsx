import React from 'react';
import { Typography, Paper } from '@mui/material';

export default function Inventory() {
  return (
    <div>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: '#1e3a8a' }}>Inventory Management</Typography>
      <Paper sx={{ p: 3 }}>Track stock levels and manage inventory with AI predictions.</Paper>
    </div>
  );
}
