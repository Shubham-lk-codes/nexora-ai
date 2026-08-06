import React from 'react';
import { Typography, Paper, Button } from '@mui/material';

export default function Vendors() {
  return (
    <div>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: '#1e3a8a' }}>Vendor Management</Typography>
      <Paper sx={{ p: 3 }}>
        <Button variant="contained" sx={{ bgcolor: '#f97316' }}>Approve Pending Vendors</Button>
      </Paper>
    </div>
  );
}
