import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Typography,
  Paper,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Button,
  LinearProgress,
  Box,
  Alert,
  AlertTitle,
} from '@mui/material';

const Quiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await axios.get(`/api/quiz/${id}`);
        setQuiz(res.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.msg || 'Failed to load quiz');
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [id]);

  const handleOptionChange = (questionId, optionId) => {
    setAnswers({
      ...answers,
      [questionId]: optionId,
    });
  };

  const handleSubmit = async () => {
    try {
      const formattedAnswers = Object.entries(answers).map(([questionId, selectedOptionId]) => ({
        questionId,
        selectedOptionId,
      }));

      const res = await axios.post(`/api/quiz/submit/${id}`, {
        answers: formattedAnswers,
      });

      setResult(res.data);
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to submit quiz');
    }
  };

  if (loading) {
    return (
      <Container sx={{ p: 3 }}>
        <LinearProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ p: 3 }}>
        <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
          {error}
        </Alert>
      </Container>
    );
  }

  if (submitted && result) {
    return (
      <Container sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Quiz Results
        </Typography>
        <Typography variant="h5" gutterBottom>
          Your score: {result.score} out of {result.totalQuestions}
        </Typography>
        <Box mt={3}>
          <Button variant="contained" color="primary" onClick={() => navigate('/')}>
            Back to Home
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {quiz.title}
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        {quiz.description}
      </Typography>

      {quiz.questions.map((question, index) => (
        <Paper key={question._id} sx={{ mb: 3 }} elevation={2}>
          <Box p={2}>
            <Typography variant="h6">
              Question {index + 1}: {question.questionText}
            </Typography>
            <FormControl component="fieldset" sx={{ ml: 2 }}>
              <RadioGroup
                name={`question-${question._id}`}
                value={answers[question._id] || ''}
                onChange={(e) => handleOptionChange(question._id, e.target.value)}
              >
                {question.options.map((option) => (
                  <FormControlLabel
                    key={option._id}
                    value={option._id}
                    control={<Radio />}
                    label={option.text}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </Box>
        </Paper>
      ))}

      <Button
        variant="contained"
        color="primary"
        size="large"
        sx={{ mt: 3 }}
        onClick={handleSubmit}
        disabled={Object.keys(answers).length !== quiz.questions.length}
      >
        Submit Quiz
      </Button>
    </Container>
  );
};

export default Quiz;
