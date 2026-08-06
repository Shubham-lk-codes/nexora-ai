import React from 'react';
import { Typography, Grid, Card, CardMedia, CardContent, Box, TextField, InputAdornment } from '@mui/material';
import { Search } from '@mui/icons-material';

const categories = ['Grocery', 'Restaurants', 'Pharmacy', 'Electronics', 'Fashion', 'Home Services'];
const products = [
  { id: 1, name: 'Fresh Organic Apples', price: '₹120/kg', image: 'https://via.placeholder.com/300', vendor: 'Green Farms' },
  { id: 2, name: 'Whole Wheat Bread', price: '₹45', image: 'https://via.placeholder.com/300', vendor: 'Baker Street' },
  { id: 3, name: 'Organic Milk 1L', price: '₹68', image: 'https://via.placeholder.com/300', vendor: 'Dairy Fresh' },
  { id: 4, name: 'Free Range Eggs', price: '₹180/dozen', image: 'https://via.placeholder.com/300', vendor: 'Farm Fresh' },
];

export default function Home() {
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ bgcolor: 'linear-gradient(135deg, #1e3a8a 0%, #f97316 100%)', p: 4, borderRadius: 3, mb: 4, color: 'white' }}>
        <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>Discover Local</Typography>
        <Typography variant="h6" sx={{ mb: 3, opacity: 0.9 }}>Powering Local Commerce with AI</Typography>
        <TextField
          fullWidth
          placeholder="Search for products, services, vendors..."
          sx={{ bgcolor: 'white', borderRadius: 2 }}
          InputProps={{ startAdornment: <InputAdornment position="start"><Search /></InputAdornment> }}
        />
      </Box>

      <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold', color: '#1e3a8a' }}>Categories</Typography>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {categories.map((cat) => (
          <Grid item xs={6} sm={4} md={2} key={cat}>
            <Card sx={{ textAlign: 'center', p: 2, cursor: 'pointer', '&:hover': { boxShadow: 4 } }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{cat}</Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold', color: '#1e3a8a' }}>Recommended for You</Typography>
      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={3} key={product.id}>
            <Card sx={{ cursor: 'pointer', '&:hover': { transform: 'translateY(-4px)', transition: '0.3s' } }}>
              <CardMedia component="img" height="200" image={product.image} alt={product.name} />
              <CardContent>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{product.name}</Typography>
                <Typography variant="body2" color="textSecondary">{product.vendor}</Typography>
                <Typography variant="h6" sx={{ color: '#f97316', fontWeight: 'bold', mt: 1 }}>{product.price}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
