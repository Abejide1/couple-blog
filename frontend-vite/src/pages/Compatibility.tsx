import React, { useState } from 'react';
import { Box, Typography, Paper, Button, Stepper, Step, StepLabel, RadioGroup, FormControlLabel, Radio, CircularProgress } from '@mui/material';

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

function getLoveLanguageResult(answers: string[]) {
  const tally: Record<string, number> = {};
  answers.forEach((ans) => {
    tally[ans] = (tally[ans] || 0) + 1;
  });
  let max = 0;
  let result = '';
  for (const lang of loveLanguages) {
    if ((tally[lang] || 0) > max) {
      max = tally[lang];
      result = lang;
    }
  }
  return result;
}

// --- Interest Matching Quiz ---
const interestOptions = [
  'Traveling', 'Cooking', 'Board Games', 'Movies', 'Hiking', 'Dancing', 'Reading', 'Photography', 'Sports', 'Music', 'Art', 'Gardening', 'Yoga', 'Tech', 'Volunteering', 'Pets', 'Fitness', 'Shopping', 'Video Games', 'Crafts'
];

function getInterestOverlap(a: string[], b: string[]) {
  return a.filter((x) => b.includes(x));
}

// --- Personality Assessment ---
const personalityQuestions = [
  {
    question: 'You’re planning a date night. What sounds best?',
    options: [
      { text: 'A cozy night in with a movie', type: 'Dreamer' },
      { text: 'A new adventure or activity', type: 'Explorer' },
      { text: 'A big party with friends', type: 'Connector' },
      { text: 'A creative project together', type: 'Creator' },
    ],
  },
  {
    question: 'How do you prefer to solve problems with your partner?',
    options: [
      { text: 'Talk it out calmly', type: 'Dreamer' },
      { text: 'Take a break and do something fun', type: 'Explorer' },
      { text: 'Ask for advice from others', type: 'Connector' },
      { text: 'Write or draw your feelings', type: 'Creator' },
    ],
  },
  {
    question: 'What’s your favorite way to show love?',
    options: [
      { text: 'Small surprises and gifts', type: 'Creator' },
      { text: 'Quality time and deep talks', type: 'Dreamer' },
      { text: 'Organizing group activities', type: 'Connector' },
      { text: 'Spontaneous adventures', type: 'Explorer' },
    ],
  },
  {
    question: 'Your ideal weekend is…',
    options: [
      { text: 'Relaxing and recharging', type: 'Dreamer' },
      { text: 'Trying something new', type: 'Explorer' },
      { text: 'Hosting or attending a gathering', type: 'Connector' },
      { text: 'Making or building something', type: 'Creator' },
    ],
  },
];

const personalityTips: Record<string, string> = {
  Dreamer: 'Dreamers value deep connection and reflection. Listen and share your feelings openly.',
  Explorer: 'Explorers thrive on novelty and excitement. Try new things together!',
  Connector: 'Connectors love social energy. Plan double dates or group adventures.',
  Creator: 'Creators express love through creativity. Make something together!',
};

const Compatibility: React.FC = () => {
  // Love Language Quiz State
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [selected, setSelected] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  // Interest Matching State
  const [showInterestQuiz, setShowInterestQuiz] = useState(false);
  const [myInterests, setMyInterests] = useState<string[]>([]);
  const [partnerInterests, setPartnerInterests] = useState<string[]>([]);
  const [showInterestResult, setShowInterestResult] = useState(false);
  // Personality Assessment State
  const [showPersonalityQuiz, setShowPersonalityQuiz] = useState(false);
  const [personalityStep, setPersonalityStep] = useState(0);
  const [personalityAnswers, setPersonalityAnswers] = useState<string[]>([]);
  const [personalityResult, setPersonalityResult] = useState<string | null>(null);
  const [personalityLoading, setPersonalityLoading] = useState(false);

  // Love Language Quiz Logic
  const handleNext = () => {
    setAnswers([...answers, selected]);
    setSelected('');
    if (step === loveLanguageQuestions.length - 1) {
      setLoading(true);
      setTimeout(() => {
        const res = getLoveLanguageResult([...answers, selected]);
        setResult(res);
        setLoading(false);
      }, 1200);
    } else {
      setStep(step + 1);
    }
  };
  const handleRestart = () => {
    setStep(0);
    setAnswers([]);
    setSelected('');
    setResult('');
    setLoading(false);
    setShowInterestQuiz(false);
    setMyInterests([]);
    setPartnerInterests([]);
    setShowInterestResult(false);
    setShowPersonalityQuiz(false);
    setPersonalityStep(0);
    setPersonalityAnswers([]);
    setPersonalityResult(null);
    setPersonalityLoading(false);
  };

  // Interest Matching Logic
  const handleInterestSubmit = () => {
    setShowInterestQuiz(false);
    setShowInterestResult(true);
  };

  return (
    <Box maxWidth={520} mx="auto" mt={6}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 6, boxShadow: '0 4px 24px #FFD6E8' }}>
        <Typography variant="h3" align="center" gutterBottom sx={{ fontWeight: 900, color: '#B388FF', mb: 2, fontFamily: 'Grotesco, Arial, sans-serif' }}>
          💞 Compatibility
        </Typography>
        {/* Love Language Quiz */}
        {!result && !loading && !showInterestQuiz && !showInterestResult && !showPersonalityQuiz && !personalityResult && (
          <>
            <Stepper activeStep={step} alternativeLabel sx={{ mb: 3 }}>
              {loveLanguageQuestions.map((_, idx) => (
                <Step key={idx}>
                  <StepLabel />
                </Step>
              ))}
            </Stepper>
            <Typography variant="h5" sx={{ mb: 2, color: '#FF7EB9', fontWeight: 700 }}>{loveLanguageQuestions[step].question}</Typography>
            <RadioGroup value={selected} onChange={(e) => setSelected(e.target.value)}>
              {loveLanguageQuestions[step].options.map((opt) => (
                <FormControlLabel key={opt} value={opt} control={<Radio sx={{ color: '#B388FF', '&.Mui-checked': { color: '#FF7EB9' } }} />} label={opt} />
              ))}
            </RadioGroup>
            <Button
              variant="contained"
              color="primary"
              size="large"
              disabled={!selected}
              onClick={handleNext}
              sx={{ mt: 3, borderRadius: 8, fontWeight: 700, fontSize: '1.1rem', animation: 'pulse 1.6s infinite', '@keyframes pulse': { '0%': { boxShadow: '0 0 0 0 #FFD6E8' }, '70%': { boxShadow: '0 0 0 14px rgba(255,214,232,0)' }, '100%': { boxShadow: '0 0 0 0 #FFD6E8' } } }}
            >
              {step === loveLanguageQuestions.length - 1 ? 'See Result' : 'Next'}
            </Button>
          </>
        )}
        {loading && <Box display="flex" flexDirection="column" alignItems="center" mt={4}><CircularProgress color="secondary" /><Typography mt={2}>Calculating your love language...</Typography></Box>}
        {result && !loading && !showInterestQuiz && !showInterestResult && !showPersonalityQuiz && !personalityResult && (
          <Box textAlign="center" mt={4}>
            <Typography variant="h4" sx={{ color: '#FF7EB9', fontWeight: 900 }}>Your Primary Love Language:</Typography>
            <Typography variant="h2" sx={{ color: '#B388FF', fontWeight: 900, mb: 2 }}>{result}</Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              Understanding your love language helps you and your partner connect deeper! Share your result and compare with your partner.
            </Typography>
            <Button variant="contained" color="primary" sx={{ borderRadius: 8, fontWeight: 700, mb: 2 }} onClick={() => setShowInterestQuiz(true)}>
              Next: Interest Matching
            </Button>
            <br />
            <Button variant="outlined" color="secondary" onClick={handleRestart} sx={{ borderRadius: 8, fontWeight: 700 }}>Try Again</Button>
          </Box>
        )}
        {/* Interest Matching Quiz */}
        {showInterestQuiz && !showInterestResult && !showPersonalityQuiz && !personalityResult && (
          <Box textAlign="center" mt={2}>
            <Typography variant="h4" sx={{ color: '#FF7EB9', fontWeight: 900, mb: 2 }}>Interest Matching</Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>Select your favorite activities/interests (pick at least 3):</Typography>
            <Box display="flex" flexWrap="wrap" gap={1} justifyContent="center" mb={2}>
              {interestOptions.map((interest) => (
                <Button
                  key={interest}
                  variant={myInterests.includes(interest) ? 'contained' : 'outlined'}
                  color={myInterests.includes(interest) ? 'primary' : 'secondary'}
                  sx={{ m: 0.5, borderRadius: 6, fontWeight: 700 }}
                  onClick={() => {
                    setMyInterests((prev) =>
                      prev.includes(interest)
                        ? prev.filter((i) => i !== interest)
                        : [...prev, interest]
                    );
                  }}
                >
                  {interest}
                </Button>
              ))}
            </Box>
            <Typography variant="body2" sx={{ mb: 2, color: '#999' }}>
              (For demo: Enter your partner's interests below. In production, this would sync between partners.)
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={1} justifyContent="center" mb={2}>
              {interestOptions.map((interest) => (
                <Button
                  key={interest}
                  variant={partnerInterests.includes(interest) ? 'contained' : 'outlined'}
                  color={partnerInterests.includes(interest) ? 'primary' : 'secondary'}
                  sx={{ m: 0.5, borderRadius: 6, fontWeight: 700, opacity: 0.7 }}
                  onClick={() => {
                    setPartnerInterests((prev) =>
                      prev.includes(interest)
                        ? prev.filter((i) => i !== interest)
                        : [...prev, interest]
                    );
                  }}
                >
                  {interest}
                </Button>
              ))}
            </Box>
            <Button
              variant="contained"
              color="primary"
              disabled={myInterests.length < 3 || partnerInterests.length < 3}
              onClick={handleInterestSubmit}
              sx={{ mt: 2, borderRadius: 8, fontWeight: 700 }}
            >
              See Your Overlap
            </Button>
            <br />
            <Button variant="outlined" color="secondary" onClick={handleRestart} sx={{ borderRadius: 8, fontWeight: 700, mt: 2 }}>Restart All</Button>
          </Box>
        )}
        {/* Interest Matching Result */}
        {showInterestResult && !showPersonalityQuiz && !personalityResult && (
          <Box textAlign="center" mt={4}>
            <Typography variant="h4" sx={{ color: '#FF7EB9', fontWeight: 900, mb: 2 }}>Your Shared Interests</Typography>
            <Box display="flex" flexWrap="wrap" gap={1} justifyContent="center" mb={2}>
              {getInterestOverlap(myInterests, partnerInterests).length === 0 ? (
                <Typography variant="body1" color="error">No overlap! Try exploring new activities together.</Typography>
              ) : (
                getInterestOverlap(myInterests, partnerInterests).map((interest) => (
                  <Paper key={interest} sx={{ p: 1, px: 2, borderRadius: 6, background: '#FFF6FB', fontWeight: 700, color: '#B388FF', boxShadow: '0 2px 8px #FFD6E8' }}>{interest}</Paper>
                ))
              )}
            </Box>
            {getInterestOverlap(myInterests, partnerInterests).length > 0 && (
              <Typography variant="body2" sx={{ mb: 2, color: '#999' }}>
                Plan your next date around a shared interest!
              </Typography>
            )}
            <Button variant="contained" color="primary" sx={{ borderRadius: 8, fontWeight: 700, mt: 2 }} onClick={() => setShowPersonalityQuiz(true)}>
              Next: Personality Assessment
            </Button>
            <br />
            <Button variant="outlined" color="secondary" onClick={handleRestart} sx={{ borderRadius: 8, fontWeight: 700, mt: 2 }}>Restart All</Button>
          </Box>
        )}
        {/* Personality Assessment Quiz */}
        {showPersonalityQuiz && !personalityResult && (
          <Box textAlign="center" mt={2}>
            <Typography variant="h4" sx={{ color: '#FF7EB9', fontWeight: 900, mb: 2 }}>Personality Assessment</Typography>
            <Stepper activeStep={personalityStep} alternativeLabel sx={{ mb: 3 }}>
              {personalityQuestions.map((_, idx) => (
                <Step key={idx}>
                  <StepLabel />
                </Step>
              ))}
            </Stepper>
            <Typography variant="h5" sx={{ mb: 2, color: '#B388FF', fontWeight: 700 }}>{personalityQuestions[personalityStep].question}</Typography>
            <RadioGroup
              value={personalityAnswers[personalityStep] || ''}
              onChange={(e) => {
                const newAnswers = [...personalityAnswers];
                newAnswers[personalityStep] = e.target.value;
                setPersonalityAnswers(newAnswers);
              }}
            >
              {personalityQuestions[personalityStep].options.map((opt) => (
                <FormControlLabel key={opt.text} value={opt.type} control={<Radio sx={{ color: '#B388FF', '&.Mui-checked': { color: '#FF7EB9' } }} />} label={opt.text} />
              ))}
            </RadioGroup>
            <Button
              variant="contained"
              color="primary"
              size="large"
              disabled={!personalityAnswers[personalityStep]}
              onClick={() => {
                if (personalityStep === personalityQuestions.length - 1) {
                  setPersonalityLoading(true);
                  setTimeout(() => {
                    // Tally the most frequent type
                    const tally: Record<string, number> = {};
                    personalityAnswers.forEach((t) => {
                      tally[t] = (tally[t] || 0) + 1;
                    });
                    const types = ['Dreamer', 'Explorer', 'Connector', 'Creator'];
                    let max = 0;
                    let result: string | null = null;
                    for (const type of types) {
                      if ((tally[type] || 0) > max) {
                        max = tally[type];
                        result = type;
                      }
                    }
                    setPersonalityResult(result);
                    setPersonalityLoading(false);
                  }, 1200);
                } else {
                  setPersonalityStep(personalityStep + 1);
                }
              }}
              sx={{ mt: 3, borderRadius: 8, fontWeight: 700, fontSize: '1.1rem', animation: 'pulse 1.6s infinite', '@keyframes pulse': { '0%': { boxShadow: '0 0 0 0 #FFD6E8' }, '70%': { boxShadow: '0 0 0 14px rgba(255,214,232,0)' }, '100%': { boxShadow: '0 0 0 0 #FFD6E8' } } }}
            >
              {personalityStep === personalityQuestions.length - 1 ? 'See Result' : 'Next'}
            </Button>
            <br />
            <Button variant="outlined" color="secondary" onClick={handleRestart} sx={{ borderRadius: 8, fontWeight: 700, mt: 2 }}>Restart All</Button>
          </Box>
        )}
        {personalityLoading && <Box display="flex" flexDirection="column" alignItems="center" mt={4}><CircularProgress color="secondary" /><Typography mt={2}>Calculating your personality type...</Typography></Box>}
        {/* Personality Assessment Result */}
        {personalityResult && !personalityLoading && (
          <Box textAlign="center" mt={4}>
            <Typography variant="h4" sx={{ color: '#FF7EB9', fontWeight: 900, mb: 2 }}>Your Personality Type</Typography>
            <Typography variant="h2" sx={{ color: '#B388FF', fontWeight: 900, mb: 2 }}>{personalityResult}</Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>{personalityTips[personalityResult]}</Typography>
            <Button variant="contained" color="primary" sx={{ borderRadius: 8, fontWeight: 700, mt: 2 }} onClick={handleRestart}>
              Restart All
            </Button>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default Compatibility;
