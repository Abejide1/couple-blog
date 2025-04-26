import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Stepper,
  Step,
  StepLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  CircularProgress,
  LinearProgress,
  Fade,
  useTheme
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CelebrationIcon from '@mui/icons-material/Celebration';

const loveLanguages = [
  'Words of Affirmation',
  'Acts of Service',
  'Receiving Gifts',
  'Quality Time',
  'Physical Touch',
];

const loveLanguageQuestions = [
  {
    question: 'How do you feel most appreciated by your partner?',
    options: loveLanguages,
  },
  {
    question: 'What do you value most in a relationship?',
    options: loveLanguages,
  },
  {
    question: 'Pick the gesture that means the most to you:',
    options: loveLanguages,
  },
  {
    question: 'How do you show love to your partner?',
    options: loveLanguages,
  },
  {
    question: 'What’s your favorite way to connect?',
    options: loveLanguages,
  },
];

function calculateCompatibility(answersA: string[], answersB: string[]) {
  if (answersA.length !== loveLanguageQuestions.length || answersB.length !== loveLanguageQuestions.length) return 0;
  let match = 0;
  for (let i = 0; i < answersA.length; i++) {
    if (answersA[i] === answersB[i]) match++;
  }
  return Math.round((match / loveLanguageQuestions.length) * 100);
}

const initialAnswers = Array(loveLanguageQuestions.length).fill('');

type QuizStep = 'userA' | 'userB' | 'result';

const Compatibility: React.FC = () => {
  const theme = useTheme();
  const [step, setStep] = useState<QuizStep>('userA');
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [answersA, setAnswersA] = useState<string[]>([...initialAnswers]);
  const [answersB, setAnswersB] = useState<string[]>([...initialAnswers]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAnswer = (value: string) => {
    if (step === 'userA') {
      const updated = [...answersA];
      updated[activeQuestion] = value;
      setAnswersA(updated);
    } else {
      const updated = [...answersB];
      updated[activeQuestion] = value;
      setAnswersB(updated);
    }
  };

  const handleNext = () => {
    if (activeQuestion < loveLanguageQuestions.length - 1) {
      setActiveQuestion(q => q + 1);
    } else if (step === 'userA') {
      setStep('userB');
      setActiveQuestion(0);
    } else {
      setLoading(true);
      setTimeout(() => {
        setShowResult(true);
        setLoading(false);
        setStep('result');
      }, 1200);
    }
  };

  const handleBack = () => {
    if (activeQuestion > 0) {
      setActiveQuestion(q => q - 1);
    } else if (step === 'userB') {
      setStep('userA');
      setActiveQuestion(loveLanguageQuestions.length - 1);
    }
  };

  const handleRestart = () => {
    setAnswersA([...initialAnswers]);
    setAnswersB([...initialAnswers]);
    setActiveQuestion(0);
    setShowResult(false);
    setStep('userA');
  };

  const progress = Math.round(((activeQuestion + (step === 'userB' ? loveLanguageQuestions.length : 0)) / (loveLanguageQuestions.length * 2)) * 100);
  const compatibility = calculateCompatibility(answersA, answersB);

  return (
    <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center" sx={{ background: 'linear-gradient(135deg, #FFD6E8 0%, #B388FF 100%)', py: 6 }}>
      <Paper elevation={5} sx={{ maxWidth: 420, width: '100%', p: { xs: 2, sm: 4 }, borderRadius: 6, textAlign: 'center', backdropFilter: 'blur(6px)' }}>
        <Typography variant="h4" fontWeight={800} color="primary" mb={2}>
          <FavoriteIcon color="error" fontSize="large" sx={{ verticalAlign: 'middle', mr: 1 }} />
          Couple Compatibility Quiz
        </Typography>
        <LinearProgress variant="determinate" value={progress} sx={{ my: 2, borderRadius: 4, height: 8 }} />
        {showResult ? (
          <Fade in={showResult}>
            <Box>
              <CelebrationIcon color="secondary" fontSize="large" sx={{ fontSize: 48, mb: 1 }} />
              <Typography variant="h5" fontWeight={700} color="secondary" gutterBottom>
                Compatibility Score: {compatibility}%
              </Typography>
              <Typography variant="body1" mb={2}>
                {compatibility === 100 && 'You are a perfect match! 💖'}
                {compatibility >= 80 && compatibility < 100 && 'You are highly compatible!'}
                {compatibility >= 60 && compatibility < 80 && 'You have a lot in common!'}
                {compatibility < 60 && 'Opposites attract! Embrace your differences.'}
              </Typography>
              <Button variant="contained" color="primary" onClick={handleRestart} sx={{ mt: 1, borderRadius: 4 }}>
                Try Again
              </Button>
            </Box>
          </Fade>
        ) : loading ? (
          <Box py={6}>
            <CircularProgress size={56} thickness={5} color="secondary" />
            <Typography variant="h6" mt={3} color="text.secondary">Calculating compatibility...</Typography>
          </Box>
        ) : (
          <Box>
            <Stepper activeStep={activeQuestion} alternativeLabel sx={{ mb: 2 }}>
              {loveLanguageQuestions.map((q, i) => (
                <Step key={i} completed={activeQuestion > i}>
                  <StepLabel />
                </Step>
              ))}
            </Stepper>
            <Typography variant="h6" fontWeight={600} mb={1}>
              {step === 'userA' ? 'Your Answers' : "Partner's Answers"}
            </Typography>
            <Typography variant="subtitle1" mb={2}>
              {loveLanguageQuestions[activeQuestion].question}
            </Typography>
            <RadioGroup
              value={step === 'userA' ? answersA[activeQuestion] : answersB[activeQuestion]}
              onChange={e => handleAnswer(e.target.value)}
              sx={{ mb: 2 }}
            >
              {loveLanguageQuestions[activeQuestion].options.map(option => (
                <FormControlLabel
                  key={option}
                  value={option}
                  control={<Radio color="primary" />}
                  label={option}
                  sx={{ borderRadius: 3, px: 2, py: 0.5, m: 0.5, background: '#FFF6FB', '&.Mui-checked': { background: '#FFD6E8' } }}
                />
              ))}
            </RadioGroup>
            <Box display="flex" justifyContent="space-between" mt={2}>
              <Button
                onClick={handleBack}
                disabled={step === 'userA' && activeQuestion === 0}
                sx={{ borderRadius: 3 }}
              >
                Back
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
                disabled={!(step === 'userA' ? answersA[activeQuestion] : answersB[activeQuestion])}
                sx={{ borderRadius: 3 }}
              >
                {activeQuestion === loveLanguageQuestions.length - 1 && step === 'userB' ? 'See Result' : 'Next'}
              </Button>
            </Box>
            <Typography variant="caption" color="text.secondary" mt={2}>
              Step {activeQuestion + 1} of {loveLanguageQuestions.length} ({step === 'userA' ? 'You' : 'Partner'})
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default Compatibility;