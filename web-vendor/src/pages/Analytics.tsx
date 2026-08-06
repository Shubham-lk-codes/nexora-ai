import React from 'react';
import { Typography, Paper } from '@mui/material';

export default function Analytics() {
  return (
    <div>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: '#1e3a8a' }}>Sales Analytics</Typography>
      <Paper sx={{ p: 3 }}>AI-powered demand forecasting and sales insights.</Paper>
    </div>
  );
}
