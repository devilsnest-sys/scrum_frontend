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
  const [filterPrimaryUser, setFilterPrimaryUser] = useState('');
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
  }, [navigate]);

  const handleRowClick = (id) => {
    navigate(`/task/${id}`);
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
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
      (filterAssignedTo === '' || (task.assigned_to && task.assigned_to.includes(filterAssignedTo))) &&
      (filterPrimaryUser === '' || (task.primary_user_name && task.primary_user_name.includes(filterPrimaryUser)))
    );
  });

  const uniqueUsers = [...new Set(tasks.flatMap(task => task.assigned_to?.split(',').map(user => user.trim()) ?? []))];
  const uniquePrimaryUsers = [...new Set(tasks.map(task => task.primary_user_name).filter(user => user))];

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isPrimaryUser = (user, primaryUserName) => user.trim() === primaryUserName;

  // Helper function to determine if the deadline is exceeded
  const isDeadlineExceeded = (deadline) => {
    if (!deadline) return false;
    const deadlineDate = new Date(deadline);
    return deadlineDate < new Date();
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
            style={{ marginRight: 8, width: '15%' }}
          />
          <TextField
            label="Status"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            variant="outlined"
            size="small"
            select
            style={{ marginRight: 8, width: '15%' }}
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
            style={{ marginRight: 8, width: '15%' }}
          >
            <MenuItem value="">All</MenuItem>
            {uniqueUsers.map(user => (
              <MenuItem key={user} value={user}>{user}</MenuItem>
            ))}
          </TextField>
          <TextField
            label="Primary User"
            value={filterPrimaryUser}
            onChange={(e) => setFilterPrimaryUser(e.target.value)}
            variant="outlined"
            size="small"
            select
            style={{ width: '15%' }}
          >
            <MenuItem value="">All</MenuItem>
            {uniquePrimaryUsers.map(user => (
              <MenuItem key={user} value={user}>{user}</MenuItem>
            ))}
          </TextField>
        </Box>
        <TableContainer component={Paper}>
        <Table>
  <TableHead>
    <TableRow sx={{ background: '#d4d4d4' }}>
      <TableCell sx={{ padding: '3px 8px' }}>ID</TableCell>
      <TableCell sx={{ padding: '3px 8px' }}>Title</TableCell>
      <TableCell sx={{ padding: '3px 8px' }}>Assigned To</TableCell>
      <TableCell sx={{ padding: '3px 8px' }}>Created By</TableCell>
      <TableCell sx={{ padding: '3px 8px' }}>Status</TableCell>
      <TableCell sx={{ padding: '3px 8px' }}>Remarks</TableCell>
      <TableCell sx={{ padding: '3px 8px' }}>Progress</TableCell>
      <TableCell sx={{ padding: '3px 8px' }}>Primary User</TableCell>
      <TableCell sx={{ padding: '3px 8px' }}>Extension</TableCell>
      <TableCell sx={{ padding: '3px 8px' }}>Extended Date</TableCell>
      <TableCell sx={{ padding: '3px 8px' }}>Created Date</TableCell>
      <TableCell sx={{ padding: '3px 8px' }}>Deadline</TableCell>
    </TableRow>
  </TableHead>
  <TableBody>
    {filteredTasks.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((task) => (
      <TableRow
        key={task.id}
        onClick={() => handleRowClick(task.id)}
        style={{
          cursor: 'pointer',
          backgroundColor: isDeadlineExceeded(task.deadline)
            ? '#f8d7da'
            : task.status === 'DONE'
            ? '#a0c3a0'
            : task.extension
            ? '#ddb0b0'
            : 'inherit',
        }}
      >
        <TableCell sx={{ padding: '3px 8px' }}>{task.id}</TableCell>
        <TableCell sx={{ padding: '3px 8px' }}>{task.title}</TableCell>
        <TableCell sx={{ padding: '3px 8px' }}>
          {task.assigned_to && task.assigned_to.split(',').map(user => (
            <span key={user} style={isPrimaryUser(user, task.primary_user_name) ? { color: 'green', fontWeight: 'bold' } : {}}>
              {user}
            </span>
          )).reduce((prev, curr) => [prev, ', ', curr])}
        </TableCell>
        <TableCell sx={{ padding: '3px 8px' }}>{task.created_by_name}</TableCell>
        <TableCell sx={{ padding: '3px 8px' }}>{task.status}</TableCell>
        <TableCell sx={{ padding: '3px 8px' }}>{task.remarks}</TableCell>
        <TableCell sx={{ padding: '3px 8px' }}>
          <Checkbox checked={task.progress === 1} readOnly />
        </TableCell>
        <TableCell sx={{ padding: '3px 8px' }}>{task.primary_user_name}</TableCell>
        <TableCell sx={{ padding: '3px 8px' }}>
          {task.extension ? <Button onClick={(e) => { e.stopPropagation(); setExtensionPopup({ open: true, taskId: task.id }); }}>Extend</Button> : 'N/A'}
        </TableCell>
        <TableCell sx={{ padding: '3px 8px' }}>
          {task.extension ? formatDate(task.extension) : 'N/A'}
        </TableCell>
        <TableCell sx={{ padding: '3px 8px' }}>
          {formatDate(task.created_at)}
        </TableCell>
        <TableCell sx={{ padding: '3px 8px' }}>
          {formatDate(task.deadline)}
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 15]}
            component="div"
            count={filteredTasks.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
        {extensionPopup.open && (
          <ExtensionPopup 
            open={extensionPopup.open} 
            onClose={() => setExtensionPopup({ open: false, taskId: null })} 
            onSave={handleExtensionSave} 
            taskId={extensionPopup.taskId} 
          />
        )}
      </Box>
    </div>
  );
};

export default Dashboard;
