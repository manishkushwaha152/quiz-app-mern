import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@mui/material';
import axios from 'axios';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Box,
  Chip
} from '@mui/material';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';

const QuizResults = () => {
  const { quizId } = useParams();
  const [results, setResults] = useState([]);
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [quizRes, resultsRes] = await Promise.all([
          axios.get(`/api/quiz/${quizId}`),
          axios.get(`/api/admin/results/${quizId}`)
        ]);
        setQuiz(quizRes.data);
        setResults(resultsRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [quizId]);

  if (loading) {
    return (
      <Container sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  // Prepare chart data
  const chartData = {
    labels: results.map((_, index) => `Attempt ${index + 1}`),
    datasets: [{
      label: 'Scores',
      data: results.map(result => result.score),
      backgroundColor: 'rgba(54, 162, 235, 0.6)',
    }]
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Results for: {quiz?.title}
      </Typography>
      
      {/* Performance Chart */}
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Performance Overview
        </Typography>
        <Box sx={{ height: '300px' }}>
          <Bar 
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                  max: quiz?.questions.length || 10
                }
              }
            }}
          />
        </Box>
      </Paper>

      {/* Detailed Results Table */}
      <Typography variant="h5" gutterBottom>
        Attempt Details
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Score</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Details</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {results.map((result) => (
              <TableRow key={result._id}>
                <TableCell>{result.user?.name || 'Anonymous'}</TableCell>
                <TableCell>
                  <Chip 
                    label={`${result.score}/${result.totalQuestions}`} 
                    color={
                      result.score/result.totalQuestions > 0.7 ? 'success' : 
                      result.score/result.totalQuestions > 0.4 ? 'warning' : 'error'
                    }
                  />
                </TableCell>
                <TableCell>
                  {new Date(result.submittedAt).toLocaleString()}
                </TableCell>
                <TableCell>
                  <Button 
                    size="small" 
                    variant="outlined"
                    onClick={() => console.log('Show detailed answers')}
                  >
                    View Answers
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default QuizResults;