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
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
} from '@mui/material';

import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';

const Dashboard = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [quizzesRes, resultsRes] = await Promise.all([
          axios.get('/api/quiz'),
          axios.get('/api/admin/results'),
        ]);
        setQuizzes(quizzesRes.data);
        setResults(resultsRes.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Container sx={{ py: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  const quizPerformanceData = {
    labels: quizzes.map((quiz) => quiz.title),
    datasets: [
      {
        label: 'Average Score',
        data: quizzes.map((quiz) => {
          const quizResults = results.filter((r) => r.quiz?._id === quiz._id);
          if (quizResults.length === 0) return 0;
          const total = quizResults.reduce((sum, r) => sum + r.score, 0);
          return (total / quizResults.length).toFixed(1);
        }),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={3} columns={12}>
        <Grid sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total Quizzes</Typography>
              <Typography variant="h3">{quizzes.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total Attempts</Typography>
              <Typography variant="h3">{results.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quiz Performance Chart */}
      <Box sx={{ mt: 5, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Quiz Performance
        </Typography>
        <Paper elevation={3} sx={{ p: 2 }}>
          <Bar
            data={quizPerformanceData}
            options={{
              scales: {
                y: {
                  beginAtZero: true,
                  max: 100,
                },
              },
            }}
          />
        </Paper>
      </Box>

      {/* Recent Results */}
      <Typography variant="h5" gutterBottom>
        Recent Results
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Quiz</TableCell>
              <TableCell>Score</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {results.slice(0, 5).map((result) => (
              <TableRow key={result._id}>
                <TableCell>{result.user?.name || 'Unknown User'}</TableCell>
                <TableCell>{result.quiz?.title || 'Unknown Quiz'}</TableCell>
                <TableCell>
                  {result.score} / {result.totalQuestions}
                </TableCell>
                <TableCell>
                  {new Date(result.submittedAt).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Manage Quizzes */}
      <Typography variant="h5" gutterBottom sx={{ mt: 6 }}>
        Manage Quizzes
      </Typography>
      <Grid container spacing={3} columns={12} sx={{ pt: 2 }}>
        {quizzes.map((quiz) => (
          <Grid key={quiz._id} sx={{ gridColumn: { xs: 'span 12', sm: 'span 6', md: 'span 4' } }}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5">
                  {quiz.title}
                </Typography>
                <Typography>{quiz.questions.length} questions</Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  color="primary"
                  component={Link}
                  to={`/admin/quiz/${quiz._id}`}
                >
                  Edit
                </Button>
                <Button
                  size="small"
                  color="secondary"
                  component={Link}
                  to={`/admin/results/${quiz._id}`}
                >
                  View Results
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
        <Grid sx={{ gridColumn: { xs: 'span 12', sm: 'span 6', md: 'span 4' } }}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography gutterBottom variant="h5">
                Create New Quiz
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                size="small"
                color="primary"
                component={Link}
                to="/admin/quiz/new"
              >
                Create
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
