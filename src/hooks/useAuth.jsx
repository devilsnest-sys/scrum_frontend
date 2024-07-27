// src/hooks/useAuth.js
import { useEffect, useState } from 'react';
import jwtDecode from 'jwt-decode';

const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
  
    useEffect(() => {
        const token = localStorage.getItem('token');
        console.log('Token:', token); // Add this for debugging
        if (token) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      }, []);
      
  
    return isAuthenticated;
  };
  

export default useAuth;
