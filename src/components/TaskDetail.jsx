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
  IconButton,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

const TaskDetail = () => {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const currentUser = localStorage.getItem('username'); // assuming you store the username in localStorage

  useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/tasks/${id}`, {
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
  }, [id]);

  const handleCommentChange = (event) => {
    setNewComment(event.target.value);
  };

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return; // Prevent empty comments

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:5000/comments`,
        { task_id: id, comment: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewComment('');
      // Re-fetch comments to update the list
      const response = await axios.get(`http://localhost:5000/tasks/${id}`, {
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
        `http://localhost:5000/tasks/${id}/status`,
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

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography variant="h6" color="error">{error}</Typography>;
  }

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatTime = (timeString) => {
    const options = { hour: 'numeric', minute: 'numeric', hour12: true };
    return new Date(timeString).toLocaleTimeString(undefined, options);
  };

  return (
    <Box p={4} style={{ width: '85%', margin: '0px 0 0 auto' }}>
      <Paper style={{ padding: 16 }}>
        <Typography variant="h4" gutterBottom>Task Details</Typography>
        <Grid container spacing={2}>
          <Grid item xs={3}>
            <TextField
              label="ID"
              value={task.id}
              fullWidth
              disabled size="small"
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              label="Title"
              value={task.title}
              fullWidth
              disabled size="small"
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              label="Assigned To"
              value={task.assigned_to}
              fullWidth
              disabled size="small"
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              label="Created By"
              value={task.created_by_name}
              fullWidth
              disabled size="small"
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              label="Status"
              value={task.status}
              fullWidth
              disabled size="small"
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              label="Created At"
              value={new Date(task.created_at).toLocaleString()}
              fullWidth
              disabled size="small"
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              label="Remarks"
              value={task.remarks}
              fullWidth
              disabled size="small"
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              label="Progress"
              value={task.progress}
              fullWidth
              disabled size="small"
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              label="Deadline"
              value={new Date(task.deadline).toLocaleString()}
              fullWidth
              disabled size="small"
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              label="Extension"
              value={task.extension}
              fullWidth
              disabled size="small"
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              label="Reason"
              value={task.reason}
              fullWidth
              disabled size="small"
            />
          </Grid>
          <Grid item xs={4}>
            <FormControl fullWidth margin="normal" size="small">
              <InputLabel>Status</InputLabel>
              <Select value={status} onChange={handleStatusChange}>
                <MenuItem value="IN PROCESS">IN PROCESS</MenuItem>
                <MenuItem value="DONE">DONE</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={5}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleStatusSubmit}
              style={{ marginTop: 16 }}
            >
              Update Status
            </Button>
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
          <Typography variant="body2" color="textSecondary" align="center" gutterBottom>
            {formatDate(new Date())}
          </Typography>
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
                  {formatTime(comment.created_at)}
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
      </Paper>
    </Box>
  );
};

export default TaskDetail;
