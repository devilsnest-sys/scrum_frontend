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
  
  // Filters
  const [filterId, setFilterId] = useState(localStorage.getItem('filterId') || '');
  const [filterStatus, setFilterStatus] = useState(localStorage.getItem('filterStatus') || '');
  const [filterAssignedTo, setFilterAssignedTo] = useState(localStorage.getItem('filterAssignedTo') || '');
  const [filterPrimaryUser, setFilterPrimaryUser] = useState(localStorage.getItem('filterPrimaryUser') || '');
  const [filterDeadline, setFilterDeadline] = useState(localStorage.getItem('filterDeadline') || '');
  const [filterExtension, setfilterExtension] = useState(localStorage.getItem('filterExtension') || '');
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
  const handleFilterChange = (setter, value, key) => {
    setter(value);
    localStorage.setItem(key, value);
  };

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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    
    return `${day}-${month}-${year}`;
  };

  const uniquePrimaryUsers = [
    ...new Set(
      tasks.map((task) => task.primary_user_name).filter((user) => user)
    ),
  ];

  const isDeadlineExceeded = (deadline) => {
    if (!deadline) return false;
    
    const today = new Date();
    const deadlineDate = new Date(deadline);
    
    // Strip the time part from both dates
    today.setHours(0, 0, 0, 0);
    deadlineDate.setHours(0, 0, 0, 0);
  
    return deadlineDate < today;
  };

  const handleResetFilters = () => {
    setFilterId('');
    setFilterStatus('');
    setFilterAssignedTo('');
    setFilterPrimaryUser('');
    setFilterDeadline('');
    setfilterExtension('');

    localStorage.removeItem('filterId');
    localStorage.removeItem('filterStatus');
    localStorage.removeItem('filterAssignedTo');
    localStorage.removeItem('filterPrimaryUser');
    localStorage.removeItem('filterDeadline');
    localStorage.removeItem('filterExtension');
  };
  

  const filteredTasks = tasks.filter((task) => {
    const isWithinDeadline = !filterDeadline || formatDate(task.deadline) === formatDate(filterDeadline);
    const isWithinExtensionDate = !filterExtension || formatDate(task.extension) === formatDate(filterExtension);

    return (
      (filterId === "" || task.id.toString().includes(filterId)) &&
      (filterStatus === "" || task.status.includes(filterStatus)) &&
      (filterAssignedTo === "" ||
        (task.assigned_to && task.assigned_to.includes(filterAssignedTo))) &&
      (filterPrimaryUser === "" ||
        (task.primary_user_name &&
          task.primary_user_name.includes(filterPrimaryUser))) &&
      isWithinDeadline &&
      isWithinExtensionDate
    );
  })
  .sort((a, b) => {
    // Custom sorting: "IN PROCESS" tasks should be at the top
    if (a.status === "IN PROCESS" && b.status !== "IN PROCESS") {
      return -1; // a comes first
    }
    if (a.status !== "IN PROCESS" && b.status === "IN PROCESS") {
      return 1; // b comes first
    }
    return 0; // Keep the order as it is
  });

  const uniqueUsers = [...new Set(tasks.flatMap(task => 
    task.assigned_to?.split(',').map(user => user.trim()) ?? []
  ))];
  

  const handleChangePage = (event, newPage) => {  
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isPrimaryUser = (user, primaryUserName) => user.trim() === primaryUserName;

  const resetfilter = (event) =>{

  };
  return (
    <div className="container mx-auto">
      <Box p={2}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Typography variant="h4">Dashboard</Typography>
          <Button variant="contained" color="primary" onClick={() => setShowPopup(true)}>
            Add Task
          </Button>
        </Box>
        {showPopup && <AddTaskPopup setShowPopup={setShowPopup} />}
        <Box display="block" justifyContent="space-between" alignItems="center" mb={2} p={1} style={{ background: '#f5f5f5', borderRadius: '4px' }}>
        <TextField
            label="Status"
            value={filterStatus}
            onChange={(e) => handleFilterChange(setFilterStatus, e.target.value, 'filterStatus')}
            variant="outlined"
            size="small"
            select
            style={{ marginRight: 8, width: "15%" }}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="IN PROCESS">IN PROCESS</MenuItem>
            <MenuItem value="DONE">DONE</MenuItem>
          </TextField>
          <TextField
            label="Assigned To"
            value={filterAssignedTo}
            onChange={(e) => handleFilterChange(setFilterAssignedTo, e.target.value, 'filterAssignedTo')}
            variant="outlined"
            size="small"
            select
            style={{ marginRight: 8, width: "15%" }}
          >
            <MenuItem value="">All</MenuItem>
            {uniqueUsers.map((user) => (
              <MenuItem key={user} value={user}>
                {user}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Primary User"
            value={filterPrimaryUser}
            onChange={(e) => handleFilterChange(setFilterPrimaryUser, e.target.value, 'filterPrimaryUser')}
            variant="outlined"
            size="small"
            select
            style={{ marginRight: 8, width: "15%" }}
          >
            <MenuItem value="">All</MenuItem>
            {uniquePrimaryUsers.map((user) => (
              <MenuItem key={user} value={user}>
                {user}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Deadline"
            type="date"
            value={filterDeadline}
            onChange={(e) => handleFilterChange(setFilterDeadline, e.target.value, 'filterDeadline')}
            variant="outlined"
            size="small"
            InputLabelProps={{ shrink: true }}
            style={{ marginRight: 8, width: "15%" }}
          />
          <TextField
            label="Extension Date"
            type="date"
            value={filterExtension}
            onChange={(e) => handleFilterChange(setfilterExtension, e.target.value, 'filterExtension')}
            variant="outlined"
            size="small"
            InputLabelProps={{ shrink: true }}
            style={{ marginRight: 8, width: "15%" }}
          />
           <Button
            variant="contained"
            color="secondary"
            onClick={handleResetFilters}
            style={{ marginLeft: 8 }}
          >
            Reset Filters
          </Button>
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
                {/* <TableCell sx={{ padding: '3px 8px' }}>Progress</TableCell> */}
                <TableCell sx={{ padding: '3px 8px' }}>Deadline</TableCell>
                <TableCell sx={{ padding: '3px 8px' }}>Extension</TableCell>
                <TableCell sx={{ padding: '3px 8px' }}>Extended Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTasks.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((task) => (
                <TableRow
                key={task.id}
                onClick={() => handleRowClick(task.id)}
                style={{
                  cursor: "pointer",
                  backgroundColor: task.status === "DONE"
                    ? "#a0c3a0" // Light green for completed tasks
                    : isDeadlineExceeded(task.deadline)
                    ? "#f8d7da" // Light pink for exceeded deadline
                    : task.extension
                    ? "#d1ecf1" // Light blue for extended tasks
                    : "inherit",
                }}
              >              
                  <TableCell sx={{ padding: '3px 8px' }}>{task.id}</TableCell>
                  <TableCell sx={{ padding: '3px 8px',maxWidth: '200px' }}>{task.title}</TableCell>
                  <TableCell sx={{ padding: '3px 8px',maxWidth: '200px' }}>
                    {task.assigned_to && task.assigned_to
                      .split(',')
                      .map(user => user.trim())
                      .map((user, index, array) => (
                        <span
                          key={user}
                          style={isPrimaryUser(user, task.primary_user_name) ? { color: 'green', fontWeight: 'bold' } : {}}
                        >
                          {user}
                          {index < array.length - 1 && ', '}
                        </span>
                      ))}
                  </TableCell>
                  <TableCell sx={{ padding: '3px 8px',maxWidth: '100px' }}>{task.created_by_name}</TableCell>
                  <TableCell sx={{ padding: '3px 8px',maxWidth: '100px' }}>{task.status}</TableCell>
                  <TableCell sx={{ padding: "3px 8px",maxWidth: '150px' }}>
                      {formatDate(task.created_at)}
                    </TableCell>
                    <TableCell sx={{ padding: '3px 8px', maxWidth: '400px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {task.remarks}
                    </TableCell>
                  {/* <TableCell sx={{ padding: '3px 8px' }}>{task.progress}</TableCell> */}
                  <TableCell sx={{ padding: "3px 8px",maxWidth: '150px' }}>
                      {formatDate(task.deadline)}
                    </TableCell>
                  <TableCell sx={{ padding: '3px 8px',maxWidth: '150px' }}>
                      {isDeadlineExceeded(task.deadline) && (
                        <Checkbox
                          onClick={(e) => {
                            e.stopPropagation();
                            setExtensionPopup({ open: true, taskId: task.id });
                          }}
                        />
                      )}
                  </TableCell>
                  <TableCell sx={{ padding: "3px 8px" }}>
                      {task.extension ? formatDate(task.extension) : "-"}
                    </TableCell>
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
