import { Typography, Paper } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', sales: 4000 },
  { name: 'Feb', sales: 3000 },
  { name: 'Mar', sales: 5000 },
  { name: 'Apr', sales: 2780 },
  { name: 'May', sales: 1890 },
  { name: 'Jun', sales: 2390 },
];

export default function Analytics() {
  return (
    <div>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: '#1e3a8a' }}>AI Analytics</Typography>
      <Paper sx={{ p: 3, height: 400 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="sales" fill="#1e3a8a" />
          </BarChart>
        </ResponsiveContainer>
      </Paper>
    </div>
  );
}
