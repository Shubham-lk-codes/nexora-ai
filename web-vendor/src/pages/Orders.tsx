import React from 'react';
import { Typography, Paper } from '@mui/material';

export default function Orders() {
  return (
    <div>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: '#1e3a8a' }}>Manage Orders</Typography>
      <Paper sx={{ p: 3 }}>Process and fulfill customer orders.</Paper>
    </div>
  );
}
