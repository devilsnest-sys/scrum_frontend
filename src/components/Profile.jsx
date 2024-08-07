import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Typography, TextField, Button, CircularProgress, Paper, Grid } from '@mui/material';
import { styled } from '@mui/system';
import Swal from 'sweetalert2';
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  margin: theme.spacing(2),
}));

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/profile`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setProfile(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handlePasswordChange = async () => {
    try {
      await axios.patch('http://192.168.0.27:5000/change-password', {
        oldPassword,
        newPassword
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
    //   alert('Password updated successfully.');'
        Swal.fire({
        icon: 'success',
        title: 'Password Change Successful',
        // text: 'Redirecting to the dashboard...',
        timer: 1500,
        timerProgressBar: true,
        showConfirmButton: false
      })
      setOldPassword('');
      setNewPassword('');
    } catch (error) {
      console.error('Error updating password:', error);
      Swal.fire({
        icon: 'error',
        title: 'Failed',
        text: 'Error updating password: '
      });
    //   alert('Failed to update password.');
    }
  };

  if (loading) return <CircularProgress />;

  if (!profile) return <div>Loading...</div>;

  return (
    <Container>
      <StyledPaper elevation={3}>
        <Typography variant="h4" gutterBottom>
          Profile
        </Typography>
        <Typography variant="h6">Username: {profile.username}</Typography>
        <Typography variant="h6">Total Tasks: {profile.total_tasks}</Typography>
        <Typography variant="h6">Tasks Done: {profile.done_tasks}</Typography>
      </StyledPaper>

      <StyledPaper elevation={3}>
        <Typography variant="h5" gutterBottom>
          Change Password
        </Typography>
        <Box component="form" noValidate autoComplete="off">
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                fullWidth
                label="Old Password"
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                fullWidth
                label="New Password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </Grid>
          </Grid>
          <Box mt={2}>
            <Button variant="contained" color="primary" onClick={handlePasswordChange}>
              Change Password
            </Button>
          </Box>
        </Box>
      </StyledPaper>
    </Container>
  );
};

export default Profile;
