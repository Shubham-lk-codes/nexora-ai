import React from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Box, Button, Paper, Grid } from '@mui/material';
import { ShoppingCart, Favorite } from '@mui/icons-material';

export default function ProductDetail() {
  const { id } = useParams();
  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography>Product Image {id}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#1e3a8a' }}>Fresh Organic Apples</Typography>
          <Typography variant="h4" sx={{ color: '#f97316', fontWeight: 'bold', my: 2 }}>₹120/kg</Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>Premium quality organic apples sourced directly from local farms. Fresh, crunchy, and naturally sweet.</Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant="contained" size="large" startIcon={<ShoppingCart />} sx={{ bgcolor: '#f97316', flex: 1 }}>Add to Cart</Button>
            <Button variant="outlined" size="large" startIcon={<Favorite />} sx={{ borderColor: '#1e3a8a', color: '#1e3a8a' }}>Wishlist</Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
