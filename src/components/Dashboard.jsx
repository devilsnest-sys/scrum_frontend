// src/components/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AddTaskPopup from './AddTaskPopup';
import zIndex from '@mui/material/styles/zIndex';
import { Margin } from '@mui/icons-material';

const Dashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const zIndex ={
        zIndex: -1,
    position: 'relative',
    }
    const wrapper = {
        margin: '0 0 0 auto',
        width: '85%',
    };
    
  
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

  return (
    <div className="p-4" style={wrapper}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl">Dashboard</h2>
        <button
          onClick={() => setShowPopup(true)}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Add Task
        </button>
      </div>
      {showPopup && <AddTaskPopup setShowPopup={setShowPopup} />}
      {/* <ul>
        {tasks.map((task) => (
          <li key={task.id} className="mb-2 p-2 border border-gray-300 rounded">
            {task.title} - {task.description}
          </li>
        ))}
      </ul> */}

      <div class="relative overflow-x-auto shadow-md sm:rounded-lg" style={zIndex}>
        <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" class="px-6 py-3">
                Title
              </th>
              <th scope="col" class="px-6 py-3">
                Description
              </th>
              <th scope="col" class="px-6 py-3">
                Assigned To
              </th>
              <th scope="col" class="px-6 py-3">
                Created By
              </th>
              <th scope="col" class="px-6 py-3">
                Status
              </th>
              <th scope="col" class="px-6 py-3">
                Created At
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tasks.map((task) => (
              <tr key={task.id}>
                <td className="px-6 py-4 whitespace-nowrap">{task.title}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {task.description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {task.assigned_to}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {task.created_by}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{task.status}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(task.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
