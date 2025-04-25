import { memo } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Grid, TextField,
  Button, FormControl, InputLabel, Select, MenuItem, Fade
} from '@mui/material';

const ClassDialog = memo(({ open, onClose, selectedClass, newClass, onClassChange, onSubmit, professors }) => {
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
        {selectedClass ? 'Edit Class' : 'Add New Class'}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              label="Class Name"
              name="name"
              value={newClass.name}
              onChange={onClassChange}
              fullWidth
              required
              variant="outlined"
              size="medium"
              sx={{ bgcolor: 'white' }}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth required variant="outlined">
              <InputLabel>Professor</InputLabel>
              <Select
                label="Professor"
                name="professorId"
                value={newClass.professorId}
                onChange={onClassChange}
                sx={{ bgcolor: 'white' }}
              >
                {professors.map(professor => (
                  <MenuItem key={professor.id} value={professor.id}>
                    {professor.name} {professor.prenom}
                  </MenuItem>
                ))}
                <MenuItem value="">Select Professor</MenuItem>
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
          disabled={!newClass.name || !newClass.professorId}
          sx={{ bgcolor: 'primary.main', px: 4 }}
        >
          {selectedClass ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
});

export default ClassDialog;