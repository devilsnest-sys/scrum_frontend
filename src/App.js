// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SideNavbar from './components/SideNavbar';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import TaskDetail from './components/TaskDetail';
import Header from './header';

function App() {
  return (
    <Router>
      <Header />
      <div className="flex">
        <SideNavbar />
        
        <div className="flex-1 p-4">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/task/:id" element={<TaskDetail />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
