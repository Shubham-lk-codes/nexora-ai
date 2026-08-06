import React from 'react';
import { Typography, Paper } from '@mui/material';

export default function Products() {
  return (
    <div>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: '#1e3a8a' }}>Product Catalog</Typography>
      <Paper sx={{ p: 3 }}>Manage all platform products and categories.</Paper>
    </div>
  );
}
