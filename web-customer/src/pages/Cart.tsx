import { Typography, Paper, Box, Button, Divider } from '@mui/material';

export default function Cart() {
  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: '#1e3a8a' }}>Shopping Cart</Typography>
      <Paper sx={{ p: 3, mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography>Fresh Organic Apples x 2kg</Typography>
          <Typography sx={{ fontWeight: 'bold' }}>₹240</Typography>
        </Box>
        <Divider sx={{ my: 2 }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6">Total</Typography>
          <Typography variant="h6" sx={{ color: '#f97316', fontWeight: 'bold' }}>₹240</Typography>
        </Box>
        <Button variant="contained" fullWidth sx={{ mt: 3, bgcolor: '#f97316', py: 1.5 }}>Proceed to Checkout</Button>
      </Paper>
    </Box>
  );
}
