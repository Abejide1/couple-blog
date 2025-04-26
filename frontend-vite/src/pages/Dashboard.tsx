import React, { useEffect, useState, useRef } from 'react';
import { Box, Typography, Grid, Paper, CircularProgress } from '@mui/material';
import Badges from '../components/Badges';
import { badgesApi } from '../services/badgesApi';
import { activitiesApi, booksApi, goalsApi, challengesApi, blogApi } from '../services/api';
import Confetti from 'react-confetti';
import { FaRegSmileBeam, FaCamera, FaBook, FaChartLine, FaStar, FaBlog, FaEnvelopeOpenText } from 'react-icons/fa';

export default function Dashboard() {
  const [badges, setBadges] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    completedActivities: 0,
    uploadedPhotos: 0,
    completedBooks: 0,
    completedGoals: 0,
    completedChallenges: 0,
    blogPosts: 0,
    messages: 0, // Placeholder for future message integration
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
        const [badgesRes, activitiesRes, booksRes, goalsRes, challengesRes, blogRes] = await Promise.all([
          badgesApi.get(),
          activitiesApi.getAll(),
          booksApi.getAll(),
          goalsApi.getAll(),
          challengesApi.getAll(),
          blogApi.getAll(),
        ]);
        // --- Streak Logic ---
        const completedDates = activitiesRes.data
          .filter((a: any) => a.status === 'completed' && a.completed_at)
          .map((a: any) => new Date(a.completed_at));
        // Sort dates ascending
        completedDates.sort((a, b) => a.getTime() - b.getTime());
        let currentStreak = 0;
        let longestStreak = 0;
        let streak = 0;
        let prevDate: Date | null = null;
        for (let i = 0; i < completedDates.length; i++) {
          if (!prevDate || (completedDates[i].getTime() - prevDate.getTime()) / 86400000 === 1) {
            streak++;
          } else if ((completedDates[i].getTime() - prevDate.getTime()) / 86400000 > 1) {
            streak = 1;
          }
          longestStreak = Math.max(longestStreak, streak);
          prevDate = completedDates[i];
        }
        // Current streak: count from last date backwards
        currentStreak = 0;
        prevDate = null;
        for (let i = completedDates.length - 1; i >= 0; i--) {
          if (!prevDate || (prevDate.getTime() - completedDates[i].getTime()) / 86400000 === 1) {
            currentStreak++;
          } else if (prevDate && (prevDate.getTime() - completedDates[i].getTime()) / 86400000 > 1) {
            break;
          }
          prevDate = completedDates[i];
        }
        setBadges(badgesRes);
        setStats({
          completedActivities: activitiesRes.data.filter((a: any) => a.status === 'completed').length,
          uploadedPhotos: activitiesRes.data.reduce((acc: number, a: any) => acc + (a.photos ? a.photos.length : 0), 0),
          completedBooks: booksRes.data.filter((b: any) => b.status === 'completed').length,
          completedGoals: goalsRes.data.filter((g: any) => g.completed).length,
          completedChallenges: challengesRes.data.filter((c: any) => c.completed).length,
          blogPosts: blogRes.data.length,
          messages: 0, // Integrate with real message count API if available
          points: (badgesRes ? Object.values(badgesRes).filter(Boolean).length * 50 : 0), // Example: 50 pts per badge
          currentStreak,
          longestStreak,
        });
      } catch (e) {
        // fallback
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
      key => badges[key] && !prevBadges.current[key]
    );
    if (unlocked) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3500);
    }
    prevBadges.current = badges;
  }, [badges]);

  if (loading) return <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh"><CircularProgress /></Box>;

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: { xs: 2, md: 4 }, position: 'relative' }}>
      {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} numberOfPieces={220} recycle={false} gravity={0.23} colors={["#FF7EB9", "#B388FF", "#FFD36E", "#7AF5FF", "#43a047", "#DC0073"]} />}
      <Typography variant="h3" align="center" fontWeight={900} color="#B388FF" mb={3} sx={{ fontFamily: '"Swanky and Moo Moo", cursive', textShadow: '0 4px 24px #FFD6E8' }}>
        Relationship Dashboard
      </Typography>
      {/* Widgets Grid */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper elevation={6} sx={{ p: 3, borderRadius: 4, textAlign: 'center', bgcolor: 'linear-gradient(120deg,#FFF6FB 60%,#FFD6E8 100%)', boxShadow: '0 4px 24px #FFD6E8', position: 'relative', overflow: 'visible' }}>
            <Typography variant="h6" color="primary" gutterBottom sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
              <FaStar color="#FFD36E" size={28} /> Badges
            </Typography>
            <Badges badges={badges} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={6} sx={{ p: 3, borderRadius: 4, textAlign: 'center', bgcolor: 'linear-gradient(120deg,#F8F8FF 60%,#B388FF22 100%)', boxShadow: '0 4px 24px #B388FF33' }}>
            <Typography variant="h6" color="secondary" gutterBottom sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
              <FaChartLine color="#43a047" size={24} /> Points
            </Typography>
            <Typography variant="h2" fontWeight={900} color="#DC0073">{stats.points}</Typography>
            <Typography variant="body2">Earn points by unlocking badges and completing activities!</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={6} sx={{ p: 3, borderRadius: 4, textAlign: 'center', bgcolor: 'linear-gradient(120deg,#E3F6FC 60%,#7AF5FF22 100%)', boxShadow: '0 4px 24px #7AF5FF33' }}>
            <Typography variant="h6" color="info.main" gutterBottom sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
              <FaRegSmileBeam color="#FF7EB9" size={24} /> Streaks
            </Typography>
            <Typography variant="h2" fontWeight={900} color="#43a047">{stats.currentStreak}</Typography>
            <Typography variant="body2">Current streak</Typography>
            <Typography variant="subtitle2" color="#B388FF">Longest: {stats.longestStreak} days</Typography>
          </Paper>
        </Grid>
        {/* Activity/Book/Goal/Challenge Widgets */}
        <Grid item xs={12} md={3}>
          <Paper elevation={4} sx={{ p: 2, borderRadius: 3, textAlign: 'center', bgcolor: '#FFF6FB', boxShadow: '0 2px 10px #FFD6E8' }}>
            <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><FaRegSmileBeam color="#FF7EB9" /> Completed Activities</Typography>
            <Typography variant="h4" color="#43a047" fontWeight={700}>{stats.completedActivities}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper elevation={4} sx={{ p: 2, borderRadius: 3, textAlign: 'center', bgcolor: '#F8F8FF', boxShadow: '0 2px 10px #B388FF33' }}>
            <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><FaCamera color="#43a047" /> Uploaded Photos</Typography>
            <Typography variant="h4" color="#B388FF" fontWeight={700}>{stats.uploadedPhotos}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper elevation={4} sx={{ p: 2, borderRadius: 3, textAlign: 'center', bgcolor: '#FFF6FB', boxShadow: '0 2px 10px #FFD36E8' }}>
            <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><FaBook color="#FFD36E" /> Completed Books</Typography>
            <Typography variant="h4" color="#FFD36E" fontWeight={700}>{stats.completedBooks}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper elevation={4} sx={{ p: 2, borderRadius: 3, textAlign: 'center', bgcolor: '#FFF6FB', boxShadow: '0 2px 10px #FFD6E8' }}>
            <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><FaChartLine color="#43a047" /> Completed Goals</Typography>
            <Typography variant="h4" color="#FF7EB9" fontWeight={700}>{stats.completedGoals}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper elevation={4} sx={{ p: 2, borderRadius: 3, textAlign: 'center', bgcolor: '#F8F8FF', boxShadow: '0 2px 10px #B388FF33' }}>
            <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><FaStar color="#FFD36E" /> Completed Challenges</Typography>
            <Typography variant="h4" color="#DC0073" fontWeight={700}>{stats.completedChallenges}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper elevation={4} sx={{ p: 2, borderRadius: 3, textAlign: 'center', bgcolor: '#E3F6FC', boxShadow: '0 2px 10px #7AF5FF33' }}>
            <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><FaBlog color="#B388FF" /> Blog Posts</Typography>
            <Typography variant="h4" color="#7AF5FF" fontWeight={700}>{stats.blogPosts}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper elevation={4} sx={{ p: 2, borderRadius: 3, textAlign: 'center', bgcolor: '#FFF6FB', boxShadow: '0 2px 10px #FFD6E8' }}>
            <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><FaEnvelopeOpenText color="#2196f3" /> Messages</Typography>
            <Typography variant="h4" color="#2196f3" fontWeight={700}>{stats.messages}</Typography>
            <Typography variant="caption" color="textSecondary">(Coming soon)</Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

