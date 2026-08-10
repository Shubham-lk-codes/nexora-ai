import { useQuery } from '@tanstack/react-query';
import { Grid, Paper, Typography, Box, CircularProgress } from '@mui/material';
import { TrendingUp, People, Store, AttachMoney } from '@mui/icons-material';
import api from '../lib/api';

const fetchStats = async () => {
  const res = await api.get('/admin/dashboard');
  return res.data;
};

export default function Dashboard() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['dashboard'],
    queryFn: fetchStats,
    retry: 2,
  });

  const stats = [
    { title: 'Total Users',  value: data?.data?.totalUsers   ?? 0,  icon: <People     sx={{ fontSize: 40, color: '#1e3a8a' }} /> },
    { title: 'Vendors',      value: data?.data?.totalVendors  ?? 0,  icon: <Store      sx={{ fontSize: 40, color: '#f97316' }} /> },
    { title: 'Orders',       value: data?.data?.totalOrders   ?? 0,  icon: <TrendingUp sx={{ fontSize: 40, color: '#10b981' }} /> },
    { title: 'Revenue',      value: `₹${(data?.data?.totalRevenue ?? 0).toLocaleString()}`, icon: <AttachMoney sx={{ fontSize: 40, color: '#8b5cf6' }} /> },
  ];

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: '#1e3a8a' }}>
        Dashboard Overview
      </Typography>

      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
          <CircularProgress />
        </Box>
      )}

      {isError && (
        <Typography color="error" sx={{ mb: 2 }}>
          Unable to reach backend. Check your connection or try again.
        </Typography>
      )}

      <Grid container spacing={3}>
        {stats.map((stat) => (
          <Grid item xs={12} sm={6} md={3} key={stat.title}>
            <Paper
              sx={{
                p: 3,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderRadius: 2,
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              }}
            >
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
