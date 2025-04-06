import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  CircularProgress,
  Box,
  Chip,
  IconButton,
  Alert
} from '@mui/material';
import { Grid } from '@mui/system';
import { useAuth } from '../context/AuthContext';
import {
  Quiz as QuizIcon,
  Timer as TimerIcon,
  School as SchoolIcon,
  Refresh as RefreshIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';

import WelcomePage from './WelcomePage';

const cardVariants = {
  offscreen: { y: 50, opacity: 0 },
  onscreen: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      bounce: 0.4,
      duration: 0.8,
    },
  },
};

const Home = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchQuizzes = async () => {
      try {
        const res = await axios.get('/api/quiz', {
          headers: { 'x-auth-token': token },
        });
        setQuizzes(res.data);
      } catch (err) {
        const status = err.response?.status;
        setError(
          status === 401
            ? 'Unauthorized. Please log in again.'
            : err.response?.data?.msg || 'Failed to load quizzes'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, [token]);

  if (!token) {
    return <WelcomePage />;
  }

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="60vh"
          flexDirection="column"
        >
          <CircularProgress size={60} thickness={4} sx={{ mb: 3 }} />
          <Typography variant="h6" color="textSecondary">
            Loading quizzes...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Alert
            severity="error"
            sx={{ mb: 3 }}
            action={
              <IconButton
                color="inherit"
                size="small"
                onClick={() => window.location.reload()}
              >
                <RefreshIcon />
              </IconButton>
            }
          >
            {error}
          </Alert>
          <Box textAlign="center">
            <Button
              variant="contained"
              color="primary"
              startIcon={<RefreshIcon />}
              onClick={() => window.location.reload()}
              sx={{ borderRadius: 2 }}
            >
              Try Again
            </Button>
          </Box>
        </motion.div>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Typography
          variant="h3"
          align="center"
          gutterBottom
          sx={{
            mb: 6,
            fontWeight: 700,
            color: 'primary.main',
            letterSpacing: '0.03em',
            position: 'relative',
            '&:after': {
              content: '""',
              display: 'block',
              width: '80px',
              height: '4px',
              background: 'linear-gradient(to right, #3f51b5, #2196f3)',
              margin: '16px auto 0',
              borderRadius: '2px',
            },
          }}
        >
          Available Quizzes
        </Typography>
      </motion.div>

      {quizzes.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Box
            textAlign="center"
            sx={{
              p: 4,
              borderRadius: 2,
              backgroundColor: 'background.paper',
              boxShadow: 1,
              maxWidth: 500,
              mx: 'auto',
            }}
          >
            <SchoolIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              No quizzes available yet
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Check back later or create your own quiz!
            </Typography>
          </Box>
        </motion.div>
      ) : (
        <Grid container spacing={4} justifyContent="center">
          {quizzes.map((quiz, index) => (
            <Grid key={quiz._id} sx={{ display: 'flex', flexBasis: { xs: '100%', sm: '50%' }, flexGrow: 1 }}>
              <motion.div
                variants={cardVariants}
                initial="offscreen"
                whileInView="onscreen"
                viewport={{ once: true, margin: "-50px" }}
                custom={index}
                style={{ width: '100%' }}
              >
                <Card
                  sx={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 3,
                    overflow: 'hidden',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 12px 20px rgba(0,0,0,0.15)',
                    },
                  }}
                >
                  <Box
                    sx={{
                      height: 160,
                      background: 'linear-gradient(45deg, #3f51b5, #2196f3)',
                      display: 'flex',
                      alignItems: 'flex-end',
                      p: 3,
                      position: 'relative',
                    }}
                  >
                    <Typography
                      variant="h5"
                      component="div"
                      sx={{
                        color: 'white',
                        fontWeight: 700,
                        position: 'relative',
                        zIndex: 1,
                        textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                      }}
                    >
                      {quiz.title}
                    </Typography>
                  </Box>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ mb: 2 }}>
                      {quiz.category && (
                        <Chip
                          label={quiz.category}
                          size="small"
                          sx={{
                            mr: 1,
                            mb: 1,
                            backgroundColor: 'primary.light',
                            color: 'primary.contrastText',
                          }}
                        />
                      )}
                      <Chip
                        icon={<QuizIcon fontSize="small" />}
                        label={`${quiz.questions.length} Qs`}
                        size="small"
                        sx={{ mr: 1, mb: 1 }}
                      />
                      {quiz.duration && (
                        <Chip
                          icon={<TimerIcon fontSize="small" />}
                          label={`${quiz.duration} min`}
                          size="small"
                          sx={{ mb: 1 }}
                        />
                      )}
                    </Box>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{
                        mb: 2,
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {quiz.description || 'Test your knowledge with this quiz!'}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ p: 2 }}>
                    <Button
                      fullWidth
                      size="medium"
                      variant="contained"
                      component={Link}
                      to={`/quiz/${quiz._id}`}
                      endIcon={<ArrowForwardIcon />}
                      sx={{
                        borderRadius: 2,
                        py: 1.5,
                        fontWeight: 'bold',
                        letterSpacing: '0.5px',
                        background: 'linear-gradient(45deg, #3f51b5, #2196f3)',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                        },
                      }}
                    >
                      Start Quiz
                    </Button>
                  </CardActions>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Home;
