import { memo, useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Grid, TextField,
  Button, FormControl, InputLabel, Select, MenuItem, Fade
} from '@mui/material';

const UserDialog = memo(({ open, onClose, selectedUser, newUser, onUserChange, onSubmit, professors }) => {
  const [classes, setClasses] = useState([]); 
  const [loadingClasses, setLoadingClasses] = useState(false); 
  const [error, setError] = useState(null); 

  const API_BASE_URL = 'http://localhost:8081/api/admin';
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };

  useEffect(() => {
    if (open) {
      const fetchClasses = async () => {
        try {
          setLoadingClasses(true);
          const response = await fetch(`${API_BASE_URL}/classes`, { headers });
          if (!response.ok) throw new Error('Failed to fetch classes');
          const data = await response.json();
          setClasses(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoadingClasses(false);
        }
      };
      fetchClasses();
    }
  }, [open]);


  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{ sx: { borderRadius: 16, p: 2 } }}
      TransitionComponent={Fade}
    >
      <DialogTitle sx={{ fontWeight: 600, color: 'text.primary' }}>
        {selectedUser ? 'Edit User' : 'Add New User'}
      </DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Last Name"
              name="name"
              value={newUser.name}
              onChange={onUserChange}
              fullWidth
              required
              variant="outlined"
              size="medium"
              sx={{ bgcolor: 'white' }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="First Name"
              name="prenom"
              value={newUser.prenom}
              onChange={onUserChange}
              fullWidth
              required
              variant="outlined"
              size="medium"
              sx={{ bgcolor: 'white' }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Password"
              name="password"
              type="password"
              value={newUser.password}
              onChange={onUserChange}
              fullWidth
              required
              variant="outlined"
              size="medium"
              sx={{ bgcolor: 'white' }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Email"
              name="email"
              type="email"
              value={newUser.email}
              onChange={onUserChange}
              fullWidth
              required
              variant="outlined"
              size="medium"
              sx={{ bgcolor: 'white' }}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth required variant="outlined">
              <InputLabel>Role</InputLabel>
              <Select
                label="Role"
                name="role"
                value={newUser.role}
                onChange={onUserChange}
                sx={{ bgcolor: 'white' }}
              >
                <MenuItem value="ETUDIANT">Student</MenuItem>
                <MenuItem value="PROFESSEUR">Professor</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{ borderColor: 'text.secondary', color: 'text.secondary' }}
        >
          Cancel
        </Button>
        <Button
          onClick={onSubmit}
          variant="contained"
          disabled={
            !newUser.name ||
            !newUser.email ||
            !newUser.prenom ||
            !newUser.password ||
            !newUser.role
          }
          sx={{ bgcolor: 'primary.main', px: 4 }}
        >
          {selectedUser ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
});

export default UserDialog;