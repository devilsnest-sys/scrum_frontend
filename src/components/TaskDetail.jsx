// src/components/TaskDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography, Paper, CircularProgress, TextField, Button, List, ListItem } from '@mui/material';

const TaskDetail = () => {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/tasks/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTask(response.data.task);
        setComments(response.data.comments);
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
        headers: { Authorization: `Bearer ${token}` },
      });
      setComments(response.data.comments);
    } catch (error) {
      console.error('There was an error posting the comment!', error);
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography variant="h6" color="error">{error}</Typography>;
  }

  return (
    <Box p={4} style={{ width: '85%', margin: '0px 0px 0px auto' }}>
      <Paper style={{ padding: 16 }}>
        <Typography variant="h4" gutterBottom>Task Details</Typography>
        <Typography variant="body1"><strong>ID:</strong> {task.id}</Typography>
        <Typography variant="body1"><strong>Title:</strong> {task.title}</Typography>
        <Typography variant="body1"><strong>Description:</strong> {task.description}</Typography>
        <Typography variant="body1"><strong>Assigned To:</strong> {task.assigned_to}</Typography>
        <Typography variant="body1"><strong>Created By:</strong> {task.created_by_name}</Typography>
        <Typography variant="body1"><strong>Status:</strong> {task.status}</Typography>
        <Typography variant="body1"><strong>Created At:</strong> {new Date(task.created_at).toLocaleString()}</Typography>
        <Typography variant="body1"><strong>Remarks:</strong> {task.remarks}</Typography>
        <Typography variant="body1"><strong>Progress:</strong> {task.progress}</Typography>
        <Typography variant="body1"><strong>Deadline:</strong> {new Date(task.deadline).toLocaleString()}</Typography>
        <Typography variant="body1"><strong>Extension:</strong> {task.extension}</Typography>
        <Typography variant="body1"><strong>Reason:</strong> {task.reason}</Typography>

        <Typography variant="h6" gutterBottom>Comments</Typography>
        <List>
          {comments.map((comment) => (
            <ListItem key={comment.id}>
              <Typography variant="body2"><strong>{comment.username}:</strong> {comment.comment}</Typography>
            </ListItem>
          ))}
        </List>
        <TextField
          label="Add a comment"
          multiline
          rows={4}
          value={newComment}
          onChange={handleCommentChange}
          fullWidth
          margin="normal"
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleCommentSubmit}
          style={{ marginTop: 16 }}
        >
          Post Comment
        </Button>
      </Paper>
    </Box>
  );
};

export default TaskDetail;
