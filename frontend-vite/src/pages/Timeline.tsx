import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Zoom
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useCouple } from '../contexts/CoupleContext';
import SimpleAvatarDisplay from '../components/SimpleAvatarDisplay';
import { styled } from '@mui/material/styles';
import { MdAdd, MdEdit, MdDelete, MdLock, MdFavorite, MdStar, MdMood, MdPlace, MdEvent } from 'react-icons/md';
import { format } from 'date-fns';

// Define milestone types with icons and colors
const milestoneTypes = [
  { id: 'anniversary', label: 'Anniversary', icon: <MdFavorite />, color: '#FF7EB9' },
  { id: 'date', label: 'Special Date', icon: <MdEvent />, color: '#B388FF' },
  { id: 'achievement', label: 'Achievement', icon: <MdStar />, color: '#FFB86B' },
  { id: 'emotion', label: 'Emotional Milestone', icon: <MdMood />, color: '#7AF5FF' },
  { id: 'place', label: 'Special Place', icon: <MdPlace />, color: '#7ED957' },
];

// Define the milestone type
interface Milestone {
  id: string;
  title: string;
  date: string;
  description: string;
  type: string;
  createdBy: string;
  createdAt: string;
  private: boolean;
}

// Styled components
const TimelineContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  maxWidth: 900,
  margin: '0 auto',
  paddingTop: 40,
  paddingBottom: 60,
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: '50%',
    width: 4,
    background: 'linear-gradient(180deg, #FF7EB9 0%, #B388FF 50%, #7AF5FF 100%)',
    borderRadius: 10,
    transform: 'translateX(-50%)',
    [theme.breakpoints.down('md')]: {
      left: 30,
    }
  }
}));

const TimelineItem = styled(Paper)(({ theme }) => ({
  position: 'relative',
  margin: '40px 0',
  padding: 20,
  borderRadius: 16,
  width: '42%',
  transition: 'all 0.3s ease',
  boxShadow: '0 4px 20px rgba(255, 126, 185, 0.15)',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 30px rgba(255, 126, 185, 0.25)',
  },
  [theme.breakpoints.down('md')]: {
    width: 'calc(100% - 80px)',
    marginLeft: 70,
  }
}));

const TimelineDot = styled(Box)(({ color }: { color?: string }) => ({
  position: 'absolute',
  top: '50%',
  left: '-48px',
  width: 40,
  height: 40,
  borderRadius: '50%',
  background: color || '#FF7EB9',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'white',
  fontSize: 20,
  transform: 'translateY(-50%)',
  zIndex: 2,
  boxShadow: '0 0 15px rgba(0, 0, 0, 0.1)',
  '@media (min-width: 900px)': {
    left: 'auto',
    right: '-48px',
  }
}));

const TimelineDate = styled(Typography)({
  fontSize: '0.85rem',
  fontWeight: 500,
  color: '#666',
  marginBottom: 8,
});

const TimelineTitle = styled(Typography)({
  fontSize: '1.2rem',
  fontWeight: 700,
  color: '#FF7EB9',
  marginBottom: 12,
});

const TimelineDescription = styled(Typography)({
  fontSize: '0.95rem',
  color: '#444',
  marginBottom: 16,
});

const MilestoneCreator = styled(Typography)({
  fontSize: '0.8rem',
  color: '#888',
  display: 'flex',
  alignItems: 'center',
  gap: 8,
});

const Timeline: React.FC = () => {
  const { user } = useAuth();
  const { coupleCode } = useCouple();
  const coupleId = coupleCode || 'default';
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentMilestone, setCurrentMilestone] = useState<Partial<Milestone>>({
    title: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    description: '',
    type: 'anniversary',
    private: false
  });
  const [isEditing, setIsEditing] = useState(false);

  // Load milestones from localStorage on component mount
  useEffect(() => {
    setLoading(true);
    try {
      const savedMilestones = localStorage.getItem(`milestones-${coupleId}`);
      if (savedMilestones) {
        setMilestones(JSON.parse(savedMilestones));
      } else {
        // Add some sample milestones for new users
        const sampleMilestones = [
          {
            id: '1',
            title: 'First Met',
            date: '2023-05-15',
            description: 'The day we first met at the coffee shop downtown.',
            type: 'anniversary',
            createdBy: user?.id?.toString() || '',
            createdAt: new Date().toISOString(),
            private: false
          },
          {
            id: '2',
            title: 'First Date',
            date: '2023-06-01',
            description: 'Our first official date at the Italian restaurant.',
            type: 'date',
            createdBy: user?.id?.toString() || '',
            createdAt: new Date().toISOString(),
            private: false
          },
          {
            id: '3',
            title: 'Trip to the Beach',
            date: '2023-08-12',
            description: 'Our weekend getaway to the coast.',
            type: 'place',
            createdBy: user?.id?.toString() || '',
            createdAt: new Date().toISOString(),
            private: false
          }
        ];
        setMilestones(sampleMilestones);
        localStorage.setItem(`milestones-${coupleId}`, JSON.stringify(sampleMilestones));
      }
    } catch (err) {
      console.error('Error loading milestones:', err);
    } finally {
      setLoading(false);
    }
  }, [coupleId, user?.id]);

  // Save milestones to localStorage whenever they change
  useEffect(() => {
    if (milestones.length > 0 && !loading) {
      localStorage.setItem(`milestones-${coupleId}`, JSON.stringify(milestones));
    }
  }, [milestones, coupleId, loading]);

  const handleOpenDialog = (milestone?: Milestone) => {
    if (milestone) {
      setCurrentMilestone(milestone);
      setIsEditing(true);
    } else {
      setCurrentMilestone({
        title: '',
        date: format(new Date(), 'yyyy-MM-dd'),
        description: '',
        type: 'anniversary',
        private: false
      });
      setIsEditing(false);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentMilestone(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    setCurrentMilestone(prev => ({ ...prev, [name]: value }));
  };

  const handlePrivateToggle = () => {
    setCurrentMilestone(prev => ({ ...prev, private: !prev.private }));
  };

  const handleSaveMilestone = () => {
    if (!currentMilestone.title || !currentMilestone.date) return;

    const now = new Date().toISOString();
    
    if (isEditing && currentMilestone.id) {
      // Update existing milestone
      setMilestones(prev => 
        prev.map(m => 
          m.id === currentMilestone.id ? { ...currentMilestone as Milestone } : m
        )
      );
    } else {
      // Add new milestone
      const newMilestone: Milestone = {
        ...currentMilestone as any,
        id: Date.now().toString(),
        createdBy: user?.id?.toString() || '',
        createdAt: now
      };
      
      setMilestones(prev => [...prev, newMilestone].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      ));
    }
    
    handleCloseDialog();
  };

  const handleDeleteMilestone = (id: string) => {
    if (window.confirm('Are you sure you want to delete this milestone?')) {
      setMilestones(prev => prev.filter(m => m.id !== id));
    }
  };

  // Get milestone type info
  const getMilestoneTypeInfo = (type: string) => {
    return milestoneTypes.find(t => t.id === type) || milestoneTypes[0];
  };

  // Sort milestones by date (newest first)
  const sortedMilestones = [...milestones].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress color="secondary" />
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', maxWidth: 900, mx: 'auto', p: { xs: 2, md: 4 } }}>
      <Box sx={{
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 4,
        background: 'linear-gradient(90deg, #FF7EB9 0%, #B388FF 100%)',
        borderRadius: 4,
        p: 3,
        boxShadow: '0 4px 20px rgba(255, 126, 185, 0.2)'
      }}>
        <Box>
          <Typography variant="h4" sx={{ 
            fontWeight: 800, 
            color: '#fff',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            Your Relationship Timeline
          </Typography>
          <Typography variant="body1" sx={{ color: '#fff', opacity: 0.9, mt: 1 }}>
            Document your journey together, one milestone at a time
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="secondary"
          startIcon={<MdAdd />}
          onClick={() => handleOpenDialog()}
          sx={{
            borderRadius: 8,
            px: 3,
            py: 1.5,
            boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
            backgroundColor: '#fff',
            color: '#FF7EB9',
            '&:hover': {
              backgroundColor: '#f8f8f8',
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 20px rgba(0,0,0,0.18)',
            }
          }}
        >
          Add Milestone
        </Button>
      </Box>

      <TimelineContainer>
        {sortedMilestones.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <Typography variant="h6" sx={{ color: '#666', mb: 2 }}>
              No milestones yet!
            </Typography>
            <Typography variant="body1" sx={{ color: '#888', mb: 3 }}>
              Start documenting your relationship journey by adding your first milestone.
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<MdAdd />}
              onClick={() => handleOpenDialog()}
              sx={{ borderRadius: 8, px: 3 }}
            >
              Add Your First Milestone
            </Button>
          </Box>
        ) : (
          sortedMilestones.map((milestone, index) => {
            const typeInfo = getMilestoneTypeInfo(milestone.type);
            const isOdd = index % 2 === 0;
            
            return (
              <Zoom in key={milestone.id} style={{ transitionDelay: `${index * 50}ms` }}>
                <TimelineItem
                  sx={{
                    float: { md: isOdd ? 'left' : 'right' },
                    clear: 'both',
                    '&::after': {
                      content: '""',
                      display: { xs: 'none', md: 'block' },
                      position: 'absolute',
                      top: '50%',
                      [isOdd ? 'right' : 'left']: -20,
                      marginTop: -10,
                      borderWidth: 10,
                      borderStyle: 'solid',
                      borderColor: isOdd 
                        ? 'transparent transparent transparent #fff' 
                        : 'transparent #fff transparent transparent',
                    }
                  }}
                >
                  <Box sx={{ position: 'absolute', top: 10, right: 10, display: 'flex', gap: 1 }}>
                    <Tooltip title="Edit milestone">
                      <IconButton size="small" onClick={() => handleOpenDialog(milestone)}>
                        <MdEdit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete milestone">
                      <IconButton size="small" color="error" onClick={() => handleDeleteMilestone(milestone.id)}>
                        <MdDelete />
                      </IconButton>
                    </Tooltip>
                    {milestone.private && (
                      <Tooltip title="Private milestone">
                        <IconButton size="small" disabled>
                          <MdLock fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                  
                  <TimelineDate>{format(new Date(milestone.date), 'MMMM d, yyyy')}</TimelineDate>
                  <TimelineTitle>{milestone.title}</TimelineTitle>
                  <TimelineDescription>{milestone.description}</TimelineDescription>
                  
                  <MilestoneCreator>
                    <SimpleAvatarDisplay size={24} displayText={user?.display_name || 'U'} />
                    Added by {milestone.createdBy === user?.id?.toString() ? 'you' : 'partner'}
                  </MilestoneCreator>
                  
                  <TimelineDot color={typeInfo.color}>
                    {typeInfo.icon}
                  </TimelineDot>
                </TimelineItem>
              </Zoom>
            );
          })
        )}
      </TimelineContainer>

      {/* Add/Edit Milestone Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ 
          background: 'linear-gradient(90deg, #FF7EB9 0%, #B388FF 100%)',
          color: '#fff',
          fontWeight: 700
        }}>
          {isEditing ? 'Edit Milestone' : 'Add New Milestone'}
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <TextField
            label="Milestone Title"
            name="title"
            value={currentMilestone.title}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
            variant="outlined"
          />
          
          <TextField
            label="Date"
            name="date"
            type="date"
            value={currentMilestone.date}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
            variant="outlined"
            InputLabelProps={{ shrink: true }}
          />
          
          <FormControl fullWidth margin="normal" variant="outlined">
            <InputLabel id="milestone-type-label">Milestone Type</InputLabel>
            <Select
              labelId="milestone-type-label"
              name="type"
              value={currentMilestone.type}
              onChange={handleSelectChange}
              label="Milestone Type"
            >
              {milestoneTypes.map(type => (
                <MenuItem key={type.id} value={type.id}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ color: type.color }}>{type.icon}</Box>
                    {type.label}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <TextField
            label="Description"
            name="description"
            value={currentMilestone.description}
            onChange={handleChange}
            fullWidth
            multiline
            rows={3}
            margin="normal"
            variant="outlined"
          />
          
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
            <Button
              startIcon={currentMilestone.private ? <MdLock /> : <MdLock color="#ccc" />}
              onClick={handlePrivateToggle}
              color={currentMilestone.private ? "secondary" : "inherit"}
              variant={currentMilestone.private ? "contained" : "outlined"}
              sx={{ borderRadius: 8 }}
            >
              {currentMilestone.private ? 'Private' : 'Make Private'}
            </Button>
            <Typography variant="caption" sx={{ ml: 2, color: '#666' }}>
              Private milestones are only visible to you
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseDialog} sx={{ borderRadius: 8 }}>
            Cancel
          </Button>
          <Button 
            onClick={handleSaveMilestone} 
            variant="contained" 
            color="secondary"
            sx={{ borderRadius: 8, px: 3 }}
            disabled={!currentMilestone.title || !currentMilestone.date}
          >
            {isEditing ? 'Update' : 'Add'} Milestone
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Timeline;
