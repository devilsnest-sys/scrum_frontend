import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import { Button, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox, TextField, MenuItem, TablePagination } from '@mui/material';
import AddTaskPopup from './AddTaskPopup';
import ExtensionPopup from './ExtensionPopup';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const socket = io(API_BASE_URL);

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [extensionPopup, setExtensionPopup] = useState({ open: false, taskId: null });
  const [extendedDetails, setExtendedDetails] = useState({});
  const [filterId, setFilterId] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterAssignedTo, setFilterAssignedTo] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_BASE_URL}/tasks`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTasks(response.data);
      } catch (error) {
        console.error('There was an error fetching the tasks!', error);
      }
    };

    fetchTasks();

    // Handle incoming WebSocket events
    socket.on('newTask', (task) => {
      setTasks((prevTasks) => [...prevTasks, task]);
    });

    socket.on('newComment', ({ task_id, comment }) => {
      setTasks((prevTasks) => {
        const updatedTasks = prevTasks.map(task => {
          if (task.id === task_id) {
            return {
              ...task,
              comments: [...task.comments, comment],
            };
          }
          return task;
        });
        return updatedTasks;
      });
    });

    // Cleanup on component unmount
    return () => {
      socket.off('newTask');
      socket.off('newComment');
    };
  }, []);

  const handleRowClick = (id) => {
    navigate(`/task/${id}`);
  };

  const handleExtensionSave = async ({ extendedDate, reason }) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`${API_BASE_URL}/tasks/${extensionPopup.taskId}/extension`, 
        { extendedDate, reason }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setExtendedDetails((prevDetails) => ({
        ...prevDetails,
        [extensionPopup.taskId]: { extendedDate, reason }
      }));

      setExtensionPopup({ open: false, taskId: null });
      // Optionally refetch tasks or update the UI to reflect changes
      const response = await axios.get(`${API_BASE_URL}/tasks`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(response.data);
      
    } catch (error) {
      console.error('There was an error updating the extension details!', error);
    }
  };

  const filteredTasks = tasks.filter(task => {
    return (
      (filterId === '' || task.id.toString().includes(filterId)) &&
      (filterStatus === '' || task.status.includes(filterStatus)) &&
      (filterAssignedTo === '' || task.assigned_to.includes(filterAssignedTo))
    );
  });

  const uniqueUsers = [...new Set(tasks.flatMap(task => task.assigned_to?.split(',').map(user => user.trim()) ?? []))];

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div className="container mx-auto">
      <Box p={4}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Typography variant="h4">Dashboard</Typography>
          <Button variant="contained" color="primary" onClick={() => setShowPopup(true)}>
            Add Task
          </Button>
        </Box>
        {showPopup && <AddTaskPopup setShowPopup={setShowPopup} />}
        <Box display="block" justifyContent="space-between" alignItems="center" mb={2} p={1} style={{ background: '#f5f5f5', borderRadius: '4px' }}>
          <TextField
            label="Task ID"
            value={filterId}
            onChange={(e) => setFilterId(e.target.value)}
            variant="outlined"
            size="small"
            style={{ marginRight: 8, width: '20%' }}
          />
          <TextField
            label="Status"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            variant="outlined"
            size="small"
            select
            style={{ marginRight: 8, width: '20%' }}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="IN PROCESS">IN PROCESS</MenuItem>
            <MenuItem value="COMPLETED">DONE</MenuItem>
          </TextField>
          <TextField
            label="Assigned To"
            value={filterAssignedTo}
            onChange={(e) => setFilterAssignedTo(e.target.value)}
            variant="outlined"
            size="small"
            select
            style={{ width: '20%' }}
          >
            <MenuItem value="">All</MenuItem>
            {uniqueUsers.map(user => (
              <MenuItem key={user} value={user}>{user}</MenuItem>
            ))}
          </TextField>
        </Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{background: '#d4d4d4' }}>
                <TableCell sx={{ padding: '3px 8px' }}>ID</TableCell>
                <TableCell sx={{ padding: '3px 8px' }}>Title</TableCell>
                <TableCell sx={{ padding: '3px 8px' }}>Assigned To</TableCell>
                <TableCell sx={{ padding: '3px 8px' }}>Created By</TableCell>
                <TableCell sx={{ padding: '3px 8px' }}>Status</TableCell>
                <TableCell sx={{ padding: '3px 8px' }}>Created At</TableCell>
                <TableCell sx={{ padding: '3px 8px' }}>Remarks</TableCell>
                <TableCell sx={{ padding: '3px 8px' }}>Progress</TableCell>
                <TableCell sx={{ padding: '3px 8px' }}>Deadline</TableCell>
                <TableCell sx={{ padding: '3px 8px' }}>Extension</TableCell>
                <TableCell sx={{ padding: '3px 8px' }}>Extended Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTasks.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((task) => (
                <TableRow key={task.id} onClick={() => handleRowClick(task.id)} style={{ cursor: 'pointer', backgroundColor: task.status === 'DONE' ? '#a0c3a0' : (task.extension ? '#ddb0b0' : 'inherit') }}>
                  <TableCell sx={{ padding: '3px 8px' }}>{task.id}</TableCell>
                  <TableCell sx={{ padding: '3px 8px' }}>{task.title}</TableCell>
                  <TableCell sx={{ padding: '3px 8px' }}>{task.assigned_to}</TableCell>
                  <TableCell sx={{ padding: '3px 8px' }}>{task.created_by_name}</TableCell>
                  <TableCell sx={{ padding: '3px 8px' }}>{task.status}</TableCell>
                  <TableCell sx={{ padding: '3px 8px' }}>{new Date(task.created_at).toLocaleString()}</TableCell>
                  <TableCell sx={{ padding: '3px 8px' }}>{task.remarks}</TableCell>
                  <TableCell sx={{ padding: '3px 8px' }}>{task.progress}</TableCell>
                  <TableCell sx={{ padding: '3px 8px' }}>{new Date(task.deadline).toLocaleString()}</TableCell>
                  <TableCell sx={{ padding: '3px 8px' }}>
                    <Checkbox
                      onClick={(e) => {
                        e.stopPropagation();
                        setExtensionPopup({ open: true, taskId: task.id });
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ padding: '3px 8px' }}>{task.extension}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={filteredTasks.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
        <ExtensionPopup
          open={extensionPopup.open}
          onClose={() => setExtensionPopup({ open: false, taskId: null })}
          onSave={handleExtensionSave}
        />
      </Box>
    </div>
  );
};

export default Dashboard;
