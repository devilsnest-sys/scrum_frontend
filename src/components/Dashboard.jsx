import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox } from '@mui/material';
import AddTaskPopup from './AddTaskPopup';
import ExtensionPopup from './ExtensionPopup';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [extensionPopup, setExtensionPopup] = useState({ open: false, taskId: null });
  const [extendedDetails, setExtendedDetails] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/tasks', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTasks(response.data);
      } catch (error) {
        console.error('There was an error fetching the tasks!', error);
      }
    };

    fetchTasks();
  }, []);

  const handleRowClick = (id) => {
    navigate(`/task/${id}`);
  };

  const handleExtensionSave = async ({ extendedDate, reason }) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`http://localhost:5000/tasks/${extensionPopup.taskId}/extension`, 
        { extendedDate, reason }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setExtendedDetails((prevDetails) => ({
        ...prevDetails,
        [extensionPopup.taskId]: { extendedDate, reason }
      }));

      setExtensionPopup({ open: false, taskId: null });
      // Optionally refetch tasks or update the UI to reflect changes
      const response = await axios.get('http://localhost:5000/tasks', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(response.data);
      
    } catch (error) {
      console.error('There was an error updating the extension details!', error);
    }
  };

  return (
    <Box p={4} style={{ margin: '0 0 0 auto', width: '85%' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4">Dashboard</Typography>
        <Button variant="contained" color="primary" onClick={() => setShowPopup(true)}>
          Add Task
        </Button>
      </Box>
      {showPopup && <AddTaskPopup setShowPopup={setShowPopup} />}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Assigned To</TableCell>
              <TableCell>Created By</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Remarks</TableCell>
              <TableCell>Progress</TableCell>
              <TableCell>Deadline</TableCell>
              <TableCell>Extension</TableCell>
              <TableCell>Extended Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.id} onClick={() => handleRowClick(task.id)} style={{ cursor: 'pointer',backgroundColor: task.extension ? '#ddb0b0' : 'inherit', }}>
                <TableCell>{task.id}</TableCell>
                <TableCell>{task.title}</TableCell>
                <TableCell>{task.assigned_to}</TableCell>
                <TableCell>{task.created_by_name}</TableCell>
                <TableCell>{task.status}</TableCell>
                <TableCell>{new Date(task.created_at).toLocaleString()}</TableCell>
                <TableCell>{task.remarks}</TableCell>
                <TableCell>{task.progress}</TableCell>
                <TableCell>{new Date(task.deadline).toLocaleString()}</TableCell>
                <TableCell>
                  <Checkbox
                    onClick={(e) => {
                      e.stopPropagation();
                      setExtensionPopup({ open: true, taskId: task.id });
                    }}
                  />
                </TableCell>
                <TableCell>{task.extension}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <ExtensionPopup
        open={extensionPopup.open}
        onClose={() => setExtensionPopup({ open: false, taskId: null })}
        onSave={handleExtensionSave}
      />
    </Box>
  );
};

export default Dashboard;
