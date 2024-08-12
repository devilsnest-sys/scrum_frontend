import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Box,
  Typography,
  Modal,
  Chip,
  OutlinedInput,
  CircularProgress,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useFetchUsers } from "./useFetchUsers";
import Swal from 'sweetalert2';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

const AddTaskPopup = ({ setShowPopup }) => {
  const theme = useTheme();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState([]);
  const [primaryAssignee, setPrimaryAssignee] = useState("");
  const [status, setStatus] = useState("IN PROCESS"); // Set default status
  const [remarks, setRemarks] = useState("");
  const [progress, setProgress] = useState("");
  const [deadline, setDeadline] = useState("");
  const [extension, setExtension] = useState("");
  const [createdBy, setCreatedBy] = useState("");
  const [loading, setLoading] = useState(false);
  const { users, error: usersError, loading: usersLoading } = useFetchUsers();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_BASE_URL}/user-details`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCreatedBy(response.data.username);
      } catch (error) {
        console.error("There was an error fetching the user details!", error);
      }
    };

    fetchUserDetails();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !status || !deadline || !primaryAssignee) {
      alert("Please fill out all required fields");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_BASE_URL}/tasks`,
        {
          title,
          description,
          assigned_to: assignedTo,
          primary_assignee: primaryAssignee,
          status,
          remarks,
          progress,
          deadline,
          extension: extension || null,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Swal.fire({
        icon: 'success',
        title: 'Task Created Successfully',
        text: 'Redirecting to the dashboard...',
        timer: 1500,
        timerProgressBar: true,
        showConfirmButton: false
      });
      setShowPopup(false);
      window.location.reload();
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Task Creation Failed',
        text: 'An error occurred while creating the task.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setAssignedTo(typeof value === "string" ? value.split(",") : value);
  };

  if (usersLoading) {
    return <CircularProgress />;
  }

  if (usersError) {
    return <Typography color="error">Failed to load users</Typography>;
  }

  return (
    <Modal
      open
      onClose={() => setShowPopup(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 1,
        }}
      >
        <Typography id="modal-modal-title" variant="h6" component="h2" mb={2}>
          Add Task
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <FormControl fullWidth margin="normal" required>
            <InputLabel id="assigned-to-label">Assigned To</InputLabel>
            <Select
              labelId="assigned-to-label"
              multiple
              value={assignedTo}
              onChange={handleChange}
              input={
                <OutlinedInput id="select-multiple-chip" label="Assigned To" />
              }
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip
                      key={value}
                      label={users.find((user) => user.id === value)?.username}
                    />
                  ))}
                </Box>
              )}
              MenuProps={MenuProps}
            >
              {users.map((user) => (
                <MenuItem
                  key={user.id}
                  value={user.id}
                  style={getStyles(user.username, assignedTo, theme)}
                >
                  {user.username}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {assignedTo.length > 0 && (
            <FormControl fullWidth margin="normal" required>
              <InputLabel id="primary-assignee-label">Primary Assignee</InputLabel>
              <Select
                labelId="primary-assignee-label"
                value={primaryAssignee}
                onChange={(e) => setPrimaryAssignee(e.target.value)}
              >
                {assignedTo.map((assigneeId) => {
                  const user = users.find((user) => user.id === assigneeId);
                  return (
                    <MenuItem key={user.id} value={user.id}>
                      {user.username}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          )}
          <FormControl fullWidth margin="normal" required>
            <InputLabel id="status-label">Status</InputLabel>
            <Select
              labelId="status-label"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <MenuItem value="IN PROCESS">IN PROCESS</MenuItem>
              {/* <MenuItem value="DONE">DONE</MenuItem> */}
            </Select>
          </FormControl>
          <TextField
            label="Remarks"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Deadline"
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
            required
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
            sx={{ mt: 2 }}
          >
            {loading ? <CircularProgress size={24} /> : "Add Task"}
          </Button>
          <Button
            onClick={() => setShowPopup(false)}
            variant="contained"
            color="secondary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Cancel
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default AddTaskPopup;
