// src/components/TaskDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography, Paper, CircularProgress } from '@mui/material';

const TaskDetail = () => {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/tasks', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const task = response.data.find((task) => task.id === parseInt(id));
        if (task) {
          setTask(task);
        } else {
          setError('Task not found');
        }
      } catch (error) {
        console.error('There was an error fetching the tasks!', error);
        setError('There was an error fetching the tasks!');
      }
    };

    fetchTasks();
  }, [id]);

  if (error) {
    return <Typography variant="h6" color="error">{error}</Typography>;
  }

  if (!task) {
    return <CircularProgress />;
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
      </Paper>
    </Box>
  );
};

export default TaskDetail;
