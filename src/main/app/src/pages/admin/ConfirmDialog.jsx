import { memo } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Fade } from '@mui/material';

const ConfirmDialog = memo(({ open, onClose, title, message, onConfirm }) => (
  <Dialog
    open={open}
    onClose={onClose}
    PaperProps={{ sx: { borderRadius: 16, p: 2 } }}
    TransitionComponent={Fade}
  >
    <DialogTitle sx={{ fontWeight: 600, color: 'text.primary' }}>
      {title}
    </DialogTitle>
    <DialogContent>
      <Typography color="text.secondary">{message}</Typography>
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
        onClick={onConfirm}
        variant="contained"
        color="error"
        sx={{ px: 4 }}
      >
        Delete
      </Button>
    </DialogActions>
  </Dialog>
));

export default ConfirmDialog;