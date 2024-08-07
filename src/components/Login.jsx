// src/components/Login.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}/login`, { username, password });
     // console.log('Token received:', response.data.token); // Debug token
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('username', response.data.username); // Store username

      // Show SweetAlert notification
      Swal.fire({
        icon: 'success',
        title: 'Login Successful',
        text: 'Redirecting to the dashboard...',
        timer: 1500,
        timerProgressBar: true,
        showConfirmButton: false
      }).then(() => {
        navigate('/dashboard');
      });

    } catch (error) {
      console.error(error);
      // Handle error case (e.g., show error message)
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: 'Please check your username and password.'
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl mb-4">Login</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mb-4 p-2 border border-gray-300 w-full"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-4 p-2 border border-gray-300 w-full"
        />
        <button type="submit" className="w-full bg-blue-500 text-white p-2">Login</button>
      </form>
    </div>
  );
};

export default Login;
