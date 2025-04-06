import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  CircularProgress,
  Alert,
  AlertTitle
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

const QuizEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState({
    title: '',
    description: '',
    questions: [],
  });

  const [loading, setLoading] = useState(!id || id === 'new');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (id && id !== 'new') {
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
    }
  }, [id]);

  const handleQuizChange = (e) => {
    setQuiz({
      ...quiz,
      [e.target.name]: e.target.value,
    });
  };

  const handleQuestionChange = (index, e) => {
    const newQuestions = [...quiz.questions];
    newQuestions[index] = {
      ...newQuestions[index],
      [e.target.name]: e.target.value,
    };
    setQuiz({ ...quiz, questions: newQuestions });
  };

  const handleOptionChange = (questionIndex, optionIndex, e) => {
    const newQuestions = [...quiz.questions];
    newQuestions[questionIndex].options[optionIndex] = {
      ...newQuestions[questionIndex].options[optionIndex],
      [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value,
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
            { text: '', isCorrect: false },
          ],
          points: 1,
        },
      ],
    });
  };

  const addOption = (questionIndex) => {
    const newQuestions = [...quiz.questions];
    newQuestions[questionIndex].options.push({
      text: '',
      isCorrect: false,
    });
    setQuiz({ ...quiz, questions: newQuestions });
  };

  const removeQuestion = (questionIndex) => {
    const newQuestions = [...quiz.questions];
    newQuestions.splice(questionIndex, 1);
    setQuiz({ ...quiz, questions: newQuestions });
  };

  const removeOption = (questionIndex, optionIndex) => {
    const newQuestions = [...quiz.questions];
    newQuestions[questionIndex].options.splice(optionIndex, 1);
    setQuiz({ ...quiz, questions: newQuestions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id === 'new') {
        await axios.post('/api/admin/quiz', quiz);
        setSuccess('Quiz created successfully!');
      } else {
        await axios.put(`/api/admin/quiz/${id}`, quiz);
        setSuccess('Quiz updated successfully!');
      }
      setTimeout(() => navigate('/admin'), 2000);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to save quiz');
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/admin/quiz/${id}`);
      setSuccess('Quiz deleted successfully!');
      setTimeout(() => navigate('/admin'), 2000);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to delete quiz');
    }
  };

  if (loading) {
    return (
      <Container sx={{ p: 3 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container sx={{ p: 3 }} maxWidth="md">
      <Typography variant="h4" gutterBottom>
        {id === 'new' ? 'Create New Quiz' : 'Edit Quiz'}
      </Typography>

      {error && (
        <Alert severity="error" onClose={() => setError(null)}>
          <AlertTitle>Error</AlertTitle>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" onClose={() => setSuccess(null)}>
          <AlertTitle>Success</AlertTitle>
          {success}
        </Alert>
      )}

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

        <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
          Questions
        </Typography>

        {quiz.questions.map((question, qIndex) => (
          <Paper key={qIndex} sx={{ mb: 3, p: 2 }} elevation={2}>
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
                <Typography variant="subtitle1">Options</Typography>
                {question.options.map((option, oIndex) => (
                  <Grid
                    container
                    key={oIndex}
                    alignItems="center"
                    spacing={2}
                    sx={{ mb: 1 }}
                  >
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
                          value={option.isCorrect ? 'yes' : 'no'}
                          onChange={(e) =>
                            handleOptionChange(qIndex, oIndex, {
                              target: {
                                name: 'isCorrect',
                                value: e.target.value === 'yes',
                              },
                            })
                          }
                        >
                          <FormControlLabel
                            value="yes"
                            control={<Radio />}
                            label="Yes"
                          />
                          <FormControlLabel
                            value="no"
                            control={<Radio />}
                            label="No"
                          />
                        </RadioGroup>
                      </FormControl>
                    </Grid>
                    <Grid item xs={1}>
                      <IconButton
                        onClick={() => removeOption(qIndex, oIndex)}
                        disabled={question.options.length <= 2}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
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
                <Divider />
                <Button
                  variant="outlined"
                  color="secondary"
                  startIcon={<DeleteIcon />}
                  onClick={() => removeQuestion(qIndex)}
                  sx={{ mt: 2 }}
                >
                  Remove Question
                </Button>
              </Grid>
            </Grid>
          </Paper>
        ))}

        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={addQuestion}
          sx={{ mb: 3 }}
        >
          Add Question
        </Button>

        <div>
          <Button type="submit" variant="contained" color="primary" size="large">
            Save Quiz
          </Button>

          {id && id !== 'new' && (
            <Button
              variant="contained"
              color="secondary"
              size="large"
              sx={{ ml: 2 }}
              onClick={handleDelete}
            >
              Delete Quiz
            </Button>
          )}
        </div>
      </form>
    </Container>
  );
};

export default QuizEditor;
