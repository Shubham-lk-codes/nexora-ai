import { Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

export default function Users() {
  return (
    <div>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: '#1e3a8a' }}>User Management</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ bgcolor: '#1e3a8a' }}>
            <TableRow>
              <TableCell sx={{ color: 'white' }}>Name</TableCell>
              <TableCell sx={{ color: 'white' }}>Email</TableCell>
              <TableCell sx={{ color: 'white' }}>Role</TableCell>
              <TableCell sx={{ color: 'white' }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow><TableCell>John Doe</TableCell><TableCell>john@nexora.ai</TableCell><TableCell>Customer</TableCell><TableCell>Active</TableCell></TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
