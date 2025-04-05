import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { makeStyles } from '@mui/styles';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useAuth } from '../context/AuthContext';

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
  },
  link: {
    color: 'white',
    textDecoration: 'none',
  },
  userText: {
    marginRight: '1rem',
    color: 'white',
  },
}));

const Navbar = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { user, logout, loading } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  if (loading) return null;

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            <Link to="/" className={classes.link}>
              Quiz App
            </Link>
          </Typography>

          {user ? (
            <>
              {/* 👤 Display user's name if available */}
              {user.name && (
                <Typography variant="body1" className={classes.userText}>
                  Welcome, {user.name}
                </Typography>
              )}

              {user.role === 'admin' && (
                <Button color="inherit">
                  <Link to="/admin" className={classes.link}>
                    Admin Dashboard
                  </Link>
                </Button>
              )}

              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit">
                <Link to="/login" className={classes.link}>
                  Login
                </Link>
              </Button>
              <Button color="inherit">
                <Link to="/register" className={classes.link}>
                  Register
                </Link>
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Navbar;
