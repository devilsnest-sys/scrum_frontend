import React, { useState } from 'react';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

const ExtensionPopup = ({ open, onClose, onSave }) => {
  const [extendedDate, setExtendedDate] = useState('');
  const [reason, setReason] = useState('');
  const [dateError, setDateError] = useState('');

  const handleSave = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set time to 00:00:00 to compare only the date part
    const selectedDate = new Date(extendedDate);

    if (selectedDate < today) {
      setDateError('The extended date cannot be in the past.');
      return;
    }

    setDateError('');
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
          error={!!dateError}
          helperText={dateError}
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
