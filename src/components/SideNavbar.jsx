// src/components/SideNavbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const SideNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); // Use 'token' to be consistent
    navigate('/login');
  };
  

  return (
    <aside id="default-sidebar" className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0" aria-label="Sidebar">
      <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
        <ul className="space-y-2 font-medium">
          <li>
            <Link to="/dashboard" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
              <svg className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 21">
                <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z"/>
                <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z"/>
              </svg>
              <span className="ms-3">Dashboard</span>
            </Link>
          </li>
          <li>
            <Link to="/login" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
              <svg className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.418 3.623-.018-.008a6.713 6.713 0 0 0-2.4-.569V2h1a1 1 0 1 0 0-2h-2a1 1 0 0 0-1 1v2H9.89A6.977 6.977 0 0 1 12 8v5h-2V8A5 5 0 1 0 0 8v6a1 1 0 0 0 1 1h8v4a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-4h6a1 1 0 0 0 1-1V8a5 5 0 0 0-2.582-4.377ZM6 12H4a1 1 0 0 1 0-2h2a1 1 0 0 1 0 2Zm0-5a2 2 0 1 1 4 0v1H7V4Zm6 5a1 1 0 1 1-2 0V7h2v5Z"/>
              </svg>
              <span className="flex-1 ms-3 whitespace-nowrap">Login</span>
              <span className="inline-flex items-center justify-center w-3 h-3 p-3 ms-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300">3</span>
            </Link>
          </li>
          <li>
            <Link to="/register" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
              <svg className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                <path d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z"/>
              </svg>
              <span className="flex-1 ms-3 whitespace-nowrap">Register</span>
            </Link>
          </li>
          {/* <li>
            <Link to="/products" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
              <svg className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
                <path d="M17 5.923A1 1 0 0 0 16 5h-3V4a4 4 0 1 0-8 0v1H2a1 1 0 0 0-1 .923L.086 17.846A2 2 0 0 0 2.08 20h13.84a2 2 0 0 0 1.994-2.153L17 5.923ZM7 9a1 1 0 0 1-2 0V7h2v2Zm0-5a2 2 0 1 1 4 0v1H7V4Zm6 5a1 1 0 1 1-2 0V7h2v2Z"/>
              </svg>
              <span className="flex-1 ms-3 whitespace-nowrap">Products</span>
            </Link>
          </li> */}
          <li>
            <Link to="/settings" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
              <svg className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 0C4.478 0 0 4.478 0 10c0 3.35 1.71 6.375 4.319 8.15A9.932 9.932 0 0 0 10 20a9.932 9.932 0 0 0 5.681-1.85C18.29 16.375 20 13.35 20 10c0-5.522-4.478-10-10-10Zm-4.387 9.632a1 1 0 0 1 0-1.265l1.625-2.4a.997.997 0 0 1 1.664 0l1.625 2.4a1 1 0 0 1-1.664 1.265L10 9.48l-1.387 2.367ZM10 6a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm5.382 2.632-1.625-2.4a1 1 0 0 1 1.664-1.265l1.625 2.4a.997.997 0 0 1 0 1.265l-1.625 2.4a1 1 0 0 1-1.664-1.265L14 9.48l1.382-2.848Z"/>
              </svg>
              <span className="flex-1 ms-3 whitespace-nowrap">Settings</span>
            </Link>
          </li>
          <li>
          <button 
            onClick={handleLogout} 
            className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group w-full"
          >
            <svg className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
              <path d="M13 16h-2v-4h2v4zm-3-8h2V4h-2v4zm6-4h-2v2h2V4zm0 16h-2v-2h2v2zM2 12c0-5.2 4.2-9.2 9.2-9.2S20.4 6.8 20.4 12c0 1.7-.5 3.3-1.4 4.6-.2.3-.4.5-.6.7-.7.7-1.5 1.3-2.5 1.7-.4.2-.9.4-1.4.6-.2.1-.5.1-.7.1-.8 0-1.6-.3-2.2-.8-.6-.6-1-1.4-1.2-2.2-.2-.5-.2-1.1 0-1.6.2-.5.5-1 1-1.3.5-.4 1.1-.7 1.8-.7.8 0 1.5.3 2 .8.4.4.6.9.8 1.4.1.3.2.6.2.9 0 .4-.2.7-.5.8-.2.2-.5.3-.8.3-.4 0-.8-.2-1.1-.5-.3-.3-.5-.6-.5-1 0-.3.1-.6.4-.8.3-.3.7-.5 1.1-.5.5 0 1 .2 1.4.5.4.3.6.7.6 1.1s-.2.8-.6 1.1c-.4.3-.8.5-1.4.5-1.4 0-2.8-.8-3.9-1.9C2.7 15.8 2 14.2 2 12zm16-4h-2v2h2V8zm-4 0h-2v2h2V8zm4 8h-2v2h2v-2zm-4 0h-2v2h2v-2z"/>
            </svg>
            <span className="flex-1 ms-3 whitespace-nowrap">Logout</span>
          </button>
          </li>
        </ul>
        
      </div>
    </aside>
  );
};

export default SideNavbar;
