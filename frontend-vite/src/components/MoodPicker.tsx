import React from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';

const moods = [
  { emoji: '😊', label: 'Happy' },
  { emoji: '😍', label: 'In Love' },
  { emoji: '🥳', label: 'Excited' },
  { emoji: '😎', label: 'Cool' },
  { emoji: '😢', label: 'Sad' },
  { emoji: '😴', label: 'Tired' },
  { emoji: '🤔', label: 'Thoughtful' },
  { emoji: '😆', label: 'Funny' },
  { emoji: '🤩', label: 'Amazed' },
  { emoji: '😇', label: 'Grateful' },
];

export default function MoodPicker({ value, onChange }: { value?: string, onChange: (mood: string) => void }) {
  return (
    <Box display="flex" flexWrap="wrap" gap={1} mt={1} mb={1}>
      {moods.map(({ emoji, label }) => (
        <Tooltip key={emoji} title={label}>
          <IconButton
            size="large"
            color={value === emoji ? 'primary' : 'default'}
            onClick={() => onChange(emoji)}
            sx={{ fontSize: 28 }}
          >
            {emoji}
          </IconButton>
        </Tooltip>
      ))}
    </Box>
  );
}
