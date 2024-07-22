// src/components/AddTaskPopup.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import zIndex from '@mui/material/styles/zIndex';

const AddTaskPopup = ({ setShowPopup }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [status, setStatus] = useState('');
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/users', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(response.data);
      } catch (error) {
        console.error('There was an error fetching the users!', error);
      }
    };

    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/tasks',
        { title, description, assigned_to: assignedTo, status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShowPopup(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-md"    >
        <h2 className="text-2xl mb-4">Add Task</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mb-4 p-2 border border-gray-300 w-full"
          />
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mb-4 p-2 border border-gray-300 w-full"
          />
          <select
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
            className="mb-4 p-2 border border-gray-300 w-full"
          >
            <option value="">Select User</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.username}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="mb-4 p-2 border border-gray-300 w-full"
          />
          <button type="submit" className="w-full bg-blue-500 text-white p-2">Add Task</button>
          <button type="button" onClick={() => setShowPopup(false)} className="w-full bg-red-500 text-white p-2 mt-2">Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default AddTaskPopup;
