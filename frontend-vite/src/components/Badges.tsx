import React from 'react';
import { Box, Chip, Tooltip } from '@mui/material';
import { FaRegSmileBeam, FaRegCheckCircle, FaRegClock, FaTrophy, FaStar, FaHeart, FaBirthdayCake, FaBook, FaCamera, FaChartLine } from 'react-icons/fa';
import { GiRibbonMedal, GiPresent } from 'react-icons/gi';

export type BadgeType = {
  key: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  earned: boolean;
};

const BADGE_LIST: Omit<BadgeType, 'earned'>[] = [
  { key: 'first_date', name: 'First Date', description: 'Complete your first activity/date together', icon: <FaHeart color="#FF7EB9" /> },
  { key: 'movie_buffs', name: 'Movie Buffs', description: 'Watch 10 movies together', icon: <FaRegSmileBeam color="#B388FF" /> },
  { key: 'bookworms', name: 'Bookworms', description: 'Finish 5 books together', icon: <FaBook color="#FFD36E" /> },
  { key: 'challenge_accepted', name: 'Challenge Accepted', description: 'Complete your first challenge', icon: <FaTrophy color="#FFD36E" /> },
  { key: 'goal_crushers', name: 'Goal Crushers', description: 'Complete 5 shared goals', icon: <FaChartLine color="#43a047" /> },
  { key: 'consistent_communicator', name: 'Consistent Communicator', description: 'Send messages for 7 days in a row', icon: <FaRegCheckCircle color="#2196f3" /> },
  { key: 'memory_makers', name: 'Memory Makers', description: 'Upload 10+ photos to your gallery', icon: <FaCamera color="#43a047" /> },
  { key: 'romantic_planner', name: 'Romantic Planner', description: 'Schedule 3 date nights in advance', icon: <FaRegClock color="#ff9800" /> },
  { key: 'mood_tracker', name: 'Mood Tracker', description: 'Log your mood 7 days in a row', icon: <FaRegSmileBeam color="#e91e63" /> },
  { key: 'anniversary_hero', name: 'Anniversary Hero', description: 'Log an anniversary or special date', icon: <FaBirthdayCake color="#FFD36E" /> },
  { key: 'bucket_list_boss', name: 'Bucket List Boss', description: 'Complete 3 bucket list items', icon: <GiRibbonMedal color="#FFD36E" /> },
  { key: 'surprise_specialist', name: 'Surprise Specialist', description: 'Use the “Surprise Me” feature 3 times', icon: <GiPresent color="#B388FF" /> },
  { key: 'streak_master', name: 'Streak Master', description: 'Achieve a 30-day activity streak', icon: <FaStar color="#FFD36E" /> },
  { key: 'early_bird', name: 'Early Bird', description: 'Log an activity before 8am, 5 times', icon: <FaRegClock color="#43a047" /> },
  { key: 'night_owl', name: 'Night Owl', description: 'Log an activity after 10pm, 5 times', icon: <FaRegClock color="#607d8b" /> },
];

export default function Badges({ badges }: { badges: Record<string, boolean> }) {
  return (
    <Box display="flex" flexWrap="wrap" gap={2}>
      {BADGE_LIST.map(badge => (
        <Tooltip key={badge.key} title={badge.description} arrow>
          <span>
            <Chip
              icon={badge.icon}
              label={badge.name}
              color={badges[badge.key] ? 'primary' : 'default'}
              variant={badges[badge.key] ? 'filled' : 'outlined'}
              sx={{ opacity: badges[badge.key] ? 1 : 0.5, fontWeight: 700, fontFamily: '"Swanky and Moo Moo", cursive', fontSize: 16 }}
            />
          </span>
        </Tooltip>
      ))}
    </Box>
  );
}
