import { Typography, Grid, Paper, Box } from '@mui/material';
import { Store, Inventory, AttachMoney, TrendingUp } from '@mui/icons-material';

const stats = [
  { title: 'Total Sales', value: '₹1,24,500', icon: <AttachMoney sx={{ fontSize: 40, color: '#1e3a8a' }} /> },
  { title: 'Products', value: '156', icon: <Inventory sx={{ fontSize: 40, color: '#f97316' }} /> },
  { title: 'Orders', value: '48', icon: <TrendingUp sx={{ fontSize: 40, color: '#10b981' }} /> },
  { title: 'Stores', value: '3', icon: <Store sx={{ fontSize: 40, color: '#8b5cf6' }} /> },
];

export default function Dashboard() {
  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: '#1e3a8a' }}>Vendor Dashboard</Typography>
      <Grid container spacing={3}>
        {stats.map((stat) => (
          <Grid item xs={12} sm={6} md={3} key={stat.title}>
            <Paper sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: 2 }}>
              <Box>
                <Typography color="textSecondary" variant="body2">{stat.title}</Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold', mt: 1 }}>{stat.value}</Typography>
              </Box>
              {stat.icon}
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
