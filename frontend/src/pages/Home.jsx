import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  CircularProgress,
  Box,
  Alert
} from '@mui/material';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    if (!token) {
      console.warn('No auth token found. User might not be logged in.');
      setError('You must be logged in to view quizzes.');
      setLoading(false);
      return;
    }

    const fetchQuizzes = async () => {
      try {
        const res = await axios.get('/api/quiz', {
          headers: { 'x-auth-token': token }
        });
        setQuizzes(res.data);
      } catch (err) {
        console.error('Error fetching quizzes:', err);
        const status = err.response?.status;

        if (status === 401) {
          setError('Unauthorized. Please log in again.');
        } else {
          setError(err.response?.data?.msg || 'Failed to load quizzes');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, [token]);

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Typography variant="h4" align="center" gutterBottom sx={{ mb: 4, fontWeight: 600 }}>
        Available Quizzes
      </Typography>

      {quizzes.length === 0 ? (
        <Typography variant="h6" align="center">
          No quizzes available yet
        </Typography>
      ) : (
        <Grid container spacing={4} columns={12}>
          {quizzes.map((quiz) => (
            <Grid
              key={quiz._id}
              sx={{
                gridColumn: {
                  xs: 'span 12',
                  sm: 'span 6',
                  md: 'span 4'
                }
              }}
            >
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'scale(1.02)',
                    boxShadow: 6
                  }
                }}
                elevation={4}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="h2">
                    {quiz.title}
                  </Typography>
                  <Typography paragraph>
                    {quiz.description || 'No description available'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {quiz.questions.length} question{quiz.questions.length !== 1 ? 's' : ''}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="medium"
                    color="primary"
                    variant="contained"
                    fullWidth
                    component={Link}
                    to={`/quiz/${quiz._id}`}
                    sx={{ mx: 1, mb: 1 }}
                  >
                    Take Quiz
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Home;
