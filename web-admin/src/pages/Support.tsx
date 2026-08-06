import React from 'react';
import { Typography, Paper } from '@mui/material';

export default function Support() {
  return (
    <div>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: '#1e3a8a' }}>Support Tickets</Typography>
      <Paper sx={{ p: 3 }}>Manage customer support tickets and escalations.</Paper>
    </div>
  );
}
