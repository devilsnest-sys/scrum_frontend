// src/components/Header.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from './assets/sg-logo-center-scrum.webp';

function Header() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token'); // Check if token exists
  const username = localStorage.getItem('username'); // Get username from localStorage

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/login'); // Redirect to login page
  };

  return (
    <header>
      <nav className="bg-white border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
          <a href="#" className="flex items-center">
            <img src={logo} className="mr-3 h-6 sm:h-9" alt="Flowbite Logo" />
            <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white"></span>
          </a>
          <div className="flex items-center lg:order-2">
            {token ? (
              <>
                <span className="text-gray-800 dark:text-white mr-4">Hello, {username}</span>
                <button
                  onClick={handleLogout}
                  className="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none dark:focus:ring-red-800"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/register" className="text-gray-800 dark:text-white hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800">
                  Register
                </Link>
                <Link to="/login" className="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800">
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;
