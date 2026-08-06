import React from 'react';
import { Typography, Paper } from '@mui/material';

export default function Orders() {
  return (
    <div>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: '#1e3a8a' }}>Order Management</Typography>
      <Paper sx={{ p: 3 }}>Orders table will be rendered here with real-time status updates.</Paper>
    </div>
  );
}
