import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  IconButton,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
  Divider,
  Box,
  Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAuth } from '../../context/AuthContext';

const AddQuiz = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState({
    title: '',
    description: '',
    questions: [{
      questionText: '',
      options: [
        { text: '', isCorrect: false },
        { text: '', isCorrect: false }
      ],
      points: 1
    }]
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleQuizChange = (e) => {
    setQuiz({ ...quiz, [e.target.name]: e.target.value });
  };

  const handleQuestionChange = (index, e) => {
    const newQuestions = [...quiz.questions];
    newQuestions[index] = {
      ...newQuestions[index],
      [e.target.name]: e.target.value
    };
    setQuiz({ ...quiz, questions: newQuestions });
  };

  const handleOptionChange = (qIndex, oIndex, e) => {
    const newQuestions = [...quiz.questions];
    newQuestions[qIndex].options[oIndex] = {
      ...newQuestions[qIndex].options[oIndex],
      [e.target.name]: e.target.type === 'radio' ? 
        (e.target.value === 'true') : 
        e.target.value
    };
    setQuiz({ ...quiz, questions: newQuestions });
  };

  const addQuestion = () => {
    setQuiz({
      ...quiz,
      questions: [
        ...quiz.questions,
        {
          questionText: '',
          options: [
            { text: '', isCorrect: false },
            { text: '', isCorrect: false }
          ],
          points: 1
        }
      ]
    });
  };

  const addOption = (qIndex) => {
    const newQuestions = [...quiz.questions];
    newQuestions[qIndex].options.push({
      text: '',
      isCorrect: false
    });
    setQuiz({ ...quiz, questions: newQuestions });
  };

  const removeQuestion = (index) => {
    const newQuestions = [...quiz.questions];
    newQuestions.splice(index, 1);
    setQuiz({ ...quiz, questions: newQuestions });
  };

  const removeOption = (qIndex, oIndex) => {
    const newQuestions = [...quiz.questions];
    newQuestions[qIndex].options.splice(oIndex, 1);
    setQuiz({ ...quiz, questions: newQuestions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/admin/quiz', quiz, {
        headers: {
          'x-auth-token': token
        }
      });
      setSuccess('Quiz created successfully!');
      setTimeout(() => navigate('/admin'), 1500);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to create quiz');
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Create New Quiz
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}

      <Paper elevation={3} sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Quiz Title"
                name="title"
                value={quiz.title}
                onChange={handleQuizChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={quiz.description}
                onChange={handleQuizChange}
                multiline
                rows={3}
              />
            </Grid>
          </Grid>

          <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
            Questions
          </Typography>

          {quiz.questions.map((question, qIndex) => (
            <Paper key={qIndex} elevation={2} sx={{ p: 2, mb: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label={`Question ${qIndex + 1}`}
                    name="questionText"
                    value={question.questionText}
                    onChange={(e) => handleQuestionChange(qIndex, e)}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Points"
                    name="points"
                    type="number"
                    value={question.points}
                    onChange={(e) => handleQuestionChange(qIndex, e)}
                    inputProps={{ min: 1 }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Options
                  </Typography>
                  {question.options.map((option, oIndex) => (
                    <Box key={oIndex} sx={{ mb: 2 }}>
                      <Grid container alignItems="center" spacing={2}>
                        <Grid item xs={8}>
                          <TextField
                            fullWidth
                            label={`Option ${oIndex + 1}`}
                            name="text"
                            value={option.text}
                            onChange={(e) => handleOptionChange(qIndex, oIndex, e)}
                            required
                          />
                        </Grid>
                        <Grid item xs={3}>
                          <FormControl component="fieldset">
                            <FormLabel component="legend">Correct?</FormLabel>
                            <RadioGroup
                              row
                              name="isCorrect"
                              value={option.isCorrect.toString()}
                              onChange={(e) => handleOptionChange(qIndex, oIndex, e)}
                            >
                              <FormControlLabel
                                value="true"
                                control={<Radio />}
                                label="Yes"
                              />
                              <FormControlLabel
                                value="false"
                                control={<Radio />}
                                label="No"
                              />
                            </RadioGroup>
                          </FormControl>
                        </Grid>
                        <Grid item xs={1}>
                          {question.options.length > 2 && (
                            <IconButton
                              onClick={() => removeOption(qIndex, oIndex)}
                              color="error"
                            >
                              <DeleteIcon />
                            </IconButton>
                          )}
                        </Grid>
                      </Grid>
                    </Box>
                  ))}
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={() => addOption(qIndex)}
                    sx={{ mt: 1 }}
                  >
                    Add Option
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => removeQuestion(qIndex)}
                    disabled={quiz.questions.length <= 1}
                  >
                    Remove Question
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          ))}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={addQuestion}
            >
              Add Question
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="success"
              size="large"
            >
              Save Quiz
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default AddQuiz;