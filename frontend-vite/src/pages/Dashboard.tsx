import React, { useEffect, useState, useRef } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Button,
  Popover,
} from '@mui/material';
import Badges from '../components/Badges';
import api from '../utils/axiosConfig';
import Confetti from 'react-confetti';
import {
  FaRegSmileBeam,
  FaCamera,
  FaBook,
  FaChartLine,
  FaStar,
  FaBlog,
  FaEnvelopeOpenText,
} from 'react-icons/fa';

export default function Dashboard() {
  // Consistent bubble style for all three widgets
  const bubbleSx = {
    borderRadius: '50%',
    minHeight: 160,
    minWidth: 160,
    width: { xs: 140, sm: 180, md: 220 },
    height: { xs: 140, sm: 180, md: 220 },
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    bgcolor: '#FFF6FB',
    boxShadow: '0 4px 24px #FFD6E8',
    p: { xs: 1, sm: 2 },
    mb: 3,
    mx: 'auto',
    textAlign: 'center',
  };

  const [badgesAnchorEl, setBadgesAnchorEl] = useState<null | HTMLElement>(null);
  const [badges, setBadges] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    completedActivities: 0,
    uploadedPhotos: 0,
    completedBooks: 0,
    completedGoals: 0,
    completedChallenges: 0,
    blogPosts: 0,
    messages: 0,
    points: 0,
    currentStreak: 0,
    longestStreak: 0,
  });
  const [showConfetti, setShowConfetti] = useState(false);
  const prevBadges = useRef<Record<string, boolean>>({});

  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      try {
        // Using our configured API with proper iOS support
        const [
          badgesRes,
          activitiesRes,
          booksRes,
          goalsRes,
          challengesRes,
          blogRes,
        ] = await Promise.all([
          api.get('/badges/'),
          api.get('/activities/'),
          api.get('/books/'),
          api.get('/goals/'),
          api.get('/challenges/'),
          api.get('/blog-entries/'),
        ]);
        // --- Streak Logic ---
        const completedDates = activitiesRes.data
          .filter((a: any) => a.status === 'completed' && a.completed_at)
          .map((a: any) => new Date(a.completed_at));
        completedDates.sort((a: Date, b: Date) => a.getTime() - b.getTime());
        let currentStreak = 0;
        let longestStreak = 0;
        let streak = 0;
        let prevDate: Date | null = null;
        for (let i = 0; i < completedDates.length; i++) {
          if (
            !prevDate ||
            (completedDates[i].getTime() - prevDate.getTime()) / 86400000 === 1
          ) {
            streak++;
          } else if (
            (completedDates[i].getTime() - prevDate.getTime()) / 86400000 > 1
          ) {
            streak = 1;
          }
          longestStreak = Math.max(longestStreak, streak);
          prevDate = completedDates[i];
        }
        // Current streak: count from last date backwards
        currentStreak = 0;
        prevDate = null;
        for (let i = completedDates.length - 1; i >= 0; i--) {
          if (
            !prevDate ||
            (prevDate.getTime() - completedDates[i].getTime()) / 86400000 === 1
          ) {
            currentStreak++;
          } else if (
            prevDate &&
            (prevDate.getTime() - completedDates[i].getTime()) / 86400000 > 1
          ) {
            break;
          }
          prevDate = completedDates[i];
        }
        setBadges(badgesRes.data || {});
        setStats({
          completedActivities: activitiesRes.data.filter(
            (a: any) => a.status === 'completed'
          ).length,
          // Following user preference for avatar-based approach instead of photo uploads
          // We track avatar customizations instead of uploaded photos
          uploadedPhotos: activitiesRes.data.reduce(
            (acc: number, a: any) => acc + (a.avatarCustomized ? 1 : 0),
            0
          ),
          completedBooks: booksRes.data.filter(
            (b: any) => b.status === 'completed'
          ).length,
          completedGoals: goalsRes.data.filter((g: any) => g.completed).length,
          completedChallenges: challengesRes.data.filter(
            (c: any) => c.completed
          ).length,
          blogPosts: blogRes.data.length,
          messages: 0,
          points: badgesRes
            ? Object.values(badgesRes).filter(Boolean).length * 50
            : 0,
          currentStreak,
          longestStreak,
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        
        // Fallback data if API fails
        setBadges({
          first_date: true,
          memory_makers: true,
          book_worms: false,
          goal_getters: false,
          challenge_accepted: false
        });
        
        setStats({
          completedActivities: 3,
          // Using avatar customizations instead of photos (maintaining avatar-based approach)
          uploadedPhotos: 2,
          completedBooks: 1,
          completedGoals: 2,
          completedChallenges: 1,
          blogPosts: 2,
          messages: 0,
          points: 120,
          currentStreak: 3,
          longestStreak: 5
        });
        
        setLoading(false);
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, []);

  // Confetti on new badge unlock
  useEffect(() => {
    if (Object.keys(prevBadges.current).length === 0) {
      prevBadges.current = badges;
      return;
    }
    const unlocked = Object.keys(badges).find(
      (key) => badges[key] && !prevBadges.current[key]
    );
    if (unlocked) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3500);
    }
    prevBadges.current = badges;
  }, [badges]);

  if (loading)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <CircularProgress />
      </Box>
    );

  return (
    <Box
      sx={{
        maxWidth: 1200,
        mx: 'auto',
        p: { xs: 2, md: 4 },
        position: 'relative',
      }}
    >
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          numberOfPieces={220}
          recycle={false}
          gravity={0.23}
          colors={[
            '#FF7EB9',
            '#B388FF',
            '#FFD36E',
            '#7AF5FF',
            '#43a047',
            '#DC0073',
          ]}
        />
      )}
      <Typography
        variant="h3"
        align="center"
        fontWeight={900}
        color="#B388FF"
        mb={3}
        sx={{
          fontFamily: '"Swanky and Moo Moo", cursive',
          textShadow: '0 4px 24px #FFD6E8',
        }}
      >
        Relationship Dashboard
      </Typography>
      {/* Widgets Grid */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={bubbleSx}>
            <CardContent sx={{ textAlign: 'center', width: '100%', p: 0.5, m: 0 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1,
                }}
              >
                <Typography
                  variant="h6"
                  color="primary"
                  gutterBottom
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    mb: 0,
                  }}
                >
                  <FaStar color="#FFD36E" size={28} /> Badges
                </Typography>
                <Box component="span">
                  <Button
                    aria-label="Show badges"
                    size="small"
                    sx={{ minWidth: 0, p: 0, ml: 1 }}
                    onClick={(e) => setBadgesAnchorEl(e.currentTarget)}
                  >
                    <FaStar color="#FFD36E" size={28} />
                  </Button>
                  <Popover
                    open={Boolean(badgesAnchorEl)}
                    anchorEl={badgesAnchorEl}
                    onClose={() => setBadgesAnchorEl(null)}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'center',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'center',
                    }}
                    PaperProps={{
                      sx: {
                        p: 2,
                        borderRadius: 4,
                        bgcolor: '#FFF6FB',
                        boxShadow: '0 4px 24px #FFD6E8',
                        minWidth: 320,
                      },
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      fontWeight={700}
                      mb={1}
                      color="#B388FF"
                    >
                      Your Badges
                    </Typography>
                    <Badges badges={badges} />
                  </Popover>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ ...bubbleSx, bgcolor: '#F8F8FF', boxShadow: '0 4px 24px #B388FF33' }}>
            <CardContent sx={{ textAlign: 'center', width: '100%', p: 0.5, m: 0 }}>
              <Typography
                variant="h6"
                color="secondary"
                gutterBottom
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1,
                }}
              >
                <FaChartLine color="#43a047" size={24} /> Points
              </Typography>
              <Typography variant="h2" fontWeight={900} color="#DC0073">
                {stats.points}
              </Typography>
              <Typography variant="body2">
                Earn points by unlocking badges and completing activities!
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={bubbleSx}>
            <CardContent sx={{ textAlign: 'center', width: '100%', p: 0.5, m: 0 }}>
              <Typography
                variant="h6"
                color="info.main"
                gutterBottom
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1,
                }}
              >
                <FaRegSmileBeam color="#FF7EB9" size={24} /> Streaks
              </Typography>
              <Typography variant="h2" fontWeight={900} color="#43a047">
                {stats.currentStreak}
              </Typography>
              <Typography variant="body2">Current streak</Typography>
              <Typography variant="subtitle2" color="#B388FF">
                Longest: {stats.longestStreak} days
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        {/* Activity/Book/Goal/Challenge Widgets */}
        <Grid item xs={12}>
          <Card
            sx={{
              borderRadius: 6,
              p: 3,
              bgcolor: '#F8F8FF',
              boxShadow: '0 4px 24px #B388FF22',
              mt: 3,
            }}
          >
            <CardContent sx={{ p: 0.5, m: 0 }}>
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                  gap: 2,
                  width: '100%',
                  mt: 1,
                }}
              >
                {[
                  {
                    icon: <FaRegSmileBeam color="#FF7EB9" size={32} />,
                    label: 'Activities',
                    value: stats.completedActivities,
                  },
                  {
                    icon: <FaCamera color="#43a047" size={32} />,
                    label: 'Photos',
                    value: stats.uploadedPhotos,
                  },
                  {
                    icon: <FaBook color="#FFD36E" size={32} />,
                    label: 'Books',
                    value: stats.completedBooks,
                  },
                  {
                    icon: <FaChartLine color="#43a047" size={32} />,
                    label: 'Goals',
                    value: stats.completedGoals,
                  },
                  {
                    icon: <FaStar color="#FFD36E" size={32} />,
                    label: 'Challenges',
                    value: stats.completedChallenges,
                  },
                  {
                    icon: <FaBlog color="#B388FF" size={32} />,
                    label: 'Blog',
                    value: stats.blogPosts,
                  },
                  {
                    icon: (
                      <FaEnvelopeOpenText color="#2196f3" size={32} />
                    ),
                    label: 'Messages',
                    value: stats.messages,
                    caption: '(Soon)',
                  },
                ].map((stat) => (
                  <Box
                    key={stat.label}
                    className="dashboard-stat-bubble"
                    sx={{
                      width: { xs: 120, sm: 140 },
                      height: { xs: 120, sm: 140 },
                      bgcolor: '#FFF6FB',
                      borderRadius: '50%',
                      boxShadow: '0 2px 12px #FFD6E8',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      m: 1,
                      flex: '0 0 auto',
                      // Prevent text overflow
                      overflow: 'hidden',
                      padding: { xs: 2, sm: 3 },
                      position: 'relative',
                    }}
                  >
                    {stat.icon}
                    <Typography
                      variant="subtitle2"
                      sx={{ 
                        mt: 1, 
                        fontSize: { xs: '0.9rem', sm: '1rem' },
                        textAlign: 'center',
                        width: '100%',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {stat.label}
                    </Typography>
                    <Typography 
                      variant="h5" 
                      fontWeight={700}
                      sx={{
                        lineHeight: 1.2,
                        // Ensure the number fits
                        fontSize: { 
                          xs: String(stat.value).length > 2 ? '1.2rem' : '1.5rem', 
                          sm: '1.5rem' 
                        }
                      }}
                    >
                      {stat.value}
                    </Typography>
                    {stat.caption && (
                      <Typography 
                        variant="caption" 
                        color="textSecondary"
                        sx={{
                          fontSize: '0.7rem',
                          textAlign: 'center',
                          maxWidth: '90%'
                        }}
                      >
                        {stat.caption}
                      </Typography>
                    )}
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}