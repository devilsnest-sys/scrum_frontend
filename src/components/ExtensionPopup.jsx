// src/components/ExtensionPopup.jsx
import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

const ExtensionPopup = ({ open, onClose, onSave }) => {
  const [extendedDate, setExtendedDate] = useState('');
  const [reason, setReason] = useState('');

  const handleSave = () => {
    onSave({ extendedDate, reason });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Extension Details</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Extended Date"
          type="date"
          fullWidth
          value={extendedDate}
          onChange={(e) => setExtendedDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          margin="dense"
          label="Reason"
          type="text"
          fullWidth
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">Cancel</Button>
        <Button onClick={handleSave} color="primary">Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ExtensionPopup;
