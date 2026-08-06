import React from 'react';
import { Typography, Paper, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

export default function Products() {
  return (
    <div>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: '#1e3a8a' }}>My Products</Typography>
      <Button variant="contained" sx={{ mb: 2, bgcolor: '#f97316' }}>Add New Product</Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ bgcolor: '#1e3a8a' }}>
            <TableRow>
              <TableCell sx={{ color: 'white' }}>Product</TableCell>
              <TableCell sx={{ color: 'white' }}>Price</TableCell>
              <TableCell sx={{ color: 'white' }}>Stock</TableCell>
              <TableCell sx={{ color: 'white' }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow><TableCell>Organic Tomatoes</TableCell><TableCell>₹45/kg</TableCell><TableCell>120</TableCell><TableCell>Active</TableCell></TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
