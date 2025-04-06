import React from 'react';
import { Container, Box, Typography, Button, Card, CardContent } from '@mui/material';
import { Link } from 'react-router-dom';
import QuizIcon from '@mui/icons-material/Quiz';

const WelcomePage = () => {
  return (
    <Container maxWidth="sm" sx={{ mt: 10 }}>
      <Card elevation={4} sx={{ borderRadius: 3, p: 4 }}>
        <CardContent>
          <Box textAlign="center">
            <QuizIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Welcome to Quiz App
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Sign in to test your knowledge with exciting quizzes across different topics!
            </Typography>
            <Box display="flex" justifyContent="center" gap={2}>
              <Button component={Link} to="/login" variant="contained" color="primary">
                Login
              </Button>
              <Button component={Link} to="/register" variant="outlined" color="primary">
                Register
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default WelcomePage;
