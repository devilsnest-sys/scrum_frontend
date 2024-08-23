// src/components/TaskDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import EditIcon from '@mui/icons-material/Edit';
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const TaskDetail = () => {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [primaryUser, setPrimaryUser] = useState('');
  const currentUser = localStorage.getItem('username'); // assuming you store the username in localStorage

  useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_BASE_URL}/tasks/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTask(response.data.task);
        setComments(response.data.comments);
        setStatus(response.data.task.status);
        setLoading(false);
      } catch (error) {
        console.error('There was an error fetching the task details!', error);
        setError('There was an error fetching the task details!');
        setLoading(false);
      }
    };

    fetchTaskDetails();

    const fetchAllUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_BASE_URL}/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAllUsers(response.data);
      } catch (error) {
        console.error('There was an error fetching users!', error);
      }
    };

    fetchAllUsers();

  }, [id]);

  const handleCommentChange = (event) => {
    setNewComment(event.target.value);
  };

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return; // Prevent empty comments

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_BASE_URL}/comments`,
        { task_id: id, comment: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewComment('');
      // Re-fetch comments to update the list
      const response = await axios.get(`${API_BASE_URL}/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` } },
      );
      setComments(response.data.comments);
    } catch (error) {
      console.error('There was an error posting the comment!', error);
    }
  };

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };

  const handleStatusSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `${API_BASE_URL}/tasks/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Update task status in state
      setTask((prevTask) => ({ ...prevTask, status }));
      console.log(`Status updated to: ${status}`);
    } catch (error) {
      console.error('There was an error updating the status!', error);
    }
  };

  const handleEditDialogOpen = () => {
    setAssignedUsers(task.assigned_to.split(', '));
    setPrimaryUser(task.primary_assigned_to);
    setOpenEditDialog(true);
  };

  const handleEditDialogClose = () => {
    setOpenEditDialog(false);
  };

  const handleAssignedUsersChange = (event) => {
    setAssignedUsers(event.target.value);
  };

  const handlePrimaryUserChange = (event) => {
    setPrimaryUser(event.target.value);
  };

  const handleEditSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `${API_BASE_URL}/tasks/${id}/update`,
        { assigned_to: assignedUsers, primary_assigned_to: primaryUser },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOpenEditDialog(false);
      const response = await axios.get(`${API_BASE_URL}/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` } },
      );
      setTask(response.data.task);
      setAssignedUsers(response.data.task.assigned_to.split(', '));
      setPrimaryUser(response.data.task.primary_assigned_to);
    } catch (error) {
      console.error('There was an error updating the task!', error);
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography variant="h6" color="error">{error}</Typography>;
  }

  // const formatDate = (dateString) => {
  //   const options = { year: 'numeric', month: 'long', day: 'numeric' };
  //   return new Date(dateString).toLocaleDateString(undefined, options);
  // };

  const formatDateTime = (dateTimeString) => {
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    };
    return new Date(dateTimeString).toLocaleString(undefined, options);
  };

  return (
    <div className="container mx-auto">
    <Box p={4}>
      <Paper style={{ padding: 16 }}>
        <Typography variant="h4" gutterBottom>Task Details</Typography>
        <Grid container spacing={2}>
          {/* <Grid item xs={3}>
            <TextField
              label="ID"
              value={task.id}
              fullWidth
              disabled size="small"
            />
          </Grid> */}
          <Grid item xs={2}>
            <TextField
              label="Title"
              value={task.title}
              fullWidth
              disabled size="small"
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              label="Assigned To"
              value={task.assigned_to}
              fullWidth
              disabled size="small"
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              label="Created By"
              value={task.created_by_name}
              fullWidth
              disabled size="small"
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              label="Status"
              value={task.status}
              fullWidth
              disabled size="small"
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              label="Created At"
              value={new Date(task.created_at).toLocaleString()}
              fullWidth
              disabled size="small"
            />
          </Grid>
          
          {/* <Grid item xs={3}>
            <TextField
              label="Progress"
              value={task.progress}
              fullWidth
              disabled size="small"
            />
          </Grid> */}
          <Grid item xs={2}>
            <TextField
              label="Deadline"
              value={new Date(task.deadline).toLocaleString()}
              fullWidth
              disabled size="small"
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              label="Extension"
              value={task.extension}
              fullWidth
              disabled size="small"
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              label="Reason"
              value={task.reason}
              fullWidth
              disabled size="small"
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              label="Primary"
              value={task.primary_assigned_to}
              fullWidth
              disabled size="small"
            />
          </Grid>
          </Grid>
          <Grid container spacing={2}>
          <Grid item xs={2}>
            <FormControl fullWidth margin="normal" size="small">
              <InputLabel>Status</InputLabel>
              <Select value={status} onChange={handleStatusChange}>
                <MenuItem value="IN PROCESS">IN PROCESS</MenuItem>
                <MenuItem value="DONE">DONE</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleStatusSubmit}
              style={{ marginTop: 16 }}
            >
              Update Status
            </Button>
            
          </Grid>
          <Grid item xs={2}>
          <Button
                variant="contained"
                color="primary"
                startIcon={<EditIcon />}
                onClick={handleEditDialogOpen}
                style={{ marginTop: 16 }}
              >
                Edit Task
              </Button>
          </Grid>
          <Grid item xs={12}>
  <TextField
    sx={{ maxWidth: '100%' }}
    label="Remarks"
    value={task.remarks}
    fullWidth
    disabled
    size="small"
    multiline
    rows={4}  // You can adjust the number of rows as needed
  />
</Grid>

        </Grid>
        <Typography variant="h6" gutterBottom>Comments</Typography>
        <Box
          style={{
            display: 'flex',
            flexDirection: 'column',
            height: '300px',
            overflowY: 'scroll',
            padding: '8px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            backgroundColor: '#f9f9f9'
          }}
        >
          {/* <Typography variant="body2" color="textSecondary" align="center" gutterBottom>
            {formatDate(new Date())}
          </Typography> */}
          {comments.map((comment) => (
            <Box
              key={comment.id}
              style={{
                display: 'flex',
                flexDirection: comment.username === currentUser ? 'row-reverse' : 'row',
                alignItems: 'flex-start',
                marginBottom: '8px'
              }}
            >
              <Box
                style={{
                  maxWidth: '70%',
                  padding: '8px',
                  borderRadius: '16px',
                  backgroundColor: comment.username === currentUser ? '#dcf8c6' : '#fff',
                  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                }}
              >
                <Typography variant="body2">
                  <strong>{comment.username}:</strong> {comment.comment}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {formatDateTime(comment.created_at)}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
        <Box style={{ display: 'flex', marginTop: '16px' }}>
          <TextField
            label="Add a comment"
            multiline
            rows={4}
            value={newComment}
            onChange={handleCommentChange}
            fullWidth
            margin="normal"
          />
          <IconButton
            color="primary"
            onClick={handleCommentSubmit}
            style={{ marginLeft: '8px', alignSelf: 'flex-end' }}
          >
            <SendIcon />
          </IconButton>
        </Box>

        {/* Popup */}
        <Dialog className='popup-ext' open={openEditDialog} onClose={handleEditDialogClose} PaperProps={{style: {width: '400px',},}}>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogContent>
              <FormControl fullWidth margin="normal" size="small">
                <InputLabel>Assigned Users</InputLabel>
                <Select
                  multiple
                  value={assignedUsers}
                  onChange={handleAssignedUsersChange}
                  renderValue={(selected) => selected.join(', ')}
                >
                  {allUsers.map((user) => (
                    <MenuItem key={user.id} value={user.username}>
                      {user.username}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth margin="normal" size="small">
                <InputLabel>Primary User</InputLabel>
                <Select
                  value={primaryUser}
                  onChange={handlePrimaryUserChange}
                >
                  {assignedUsers.map((user) => (
                    <MenuItem key={user} value={user}>
                      {user}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleEditDialogClose} color="secondary">
                Cancel
              </Button>
              <Button onClick={handleEditSubmit} color="primary">
                Save
              </Button>
            </DialogActions>
          </Dialog>
        </Paper>
      </Box>
    </div>
  );
};

export default TaskDetail;
