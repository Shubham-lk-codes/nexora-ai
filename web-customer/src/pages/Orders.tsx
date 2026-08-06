import React from 'react';
import { Typography, Paper, Box, Chip } from '@mui/material';

export default function Orders() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: '#1e3a8a' }}>My Orders</Typography>
      <Paper sx={{ p: 3, mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h6">Order #NXR-123456</Typography>
            <Typography variant="body2" color="textSecondary">Placed on Aug 1, 2026</Typography>
          </Box>
          <Chip label="Delivered" color="success" />
        </Box>
      </Paper>
    </Box>
  );
}
