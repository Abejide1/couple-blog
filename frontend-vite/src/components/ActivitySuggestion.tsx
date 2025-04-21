import React, { useState, useEffect } from 'react';
import {
    Card,
    CardContent,
    Typography,
    Button,
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CircularProgress,
    Chip,
} from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';
import { Activity } from '../types';

interface ActivitySuggestionProps {
    onAccept: (activity: Activity) => void;
}

interface FilterOptions {
    categories: string[];
    difficulties: string[];
    costs: string[];
    seasons: string[];
}

const ActivitySuggestion: React.FC<ActivitySuggestionProps> = ({ onAccept }) => {
    const [suggestedActivity, setSuggestedActivity] = useState<Activity | null>(null);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        category: '',
        difficulty: '',
        cost: '',
        season: '',
    });
    const [options, setOptions] = useState<FilterOptions>({
        categories: [],
        difficulties: [],
        costs: [],
        seasons: [],
    });

    // Fetch filter options
    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const [categories, difficulties, costs, seasons] = await Promise.all([
                    fetch('http://localhost:8000/activities/categories').then(res => res.json()),
                    fetch('http://localhost:8000/activities/difficulties').then(res => res.json()),
                    fetch('http://localhost:8000/activities/costs').then(res => res.json()),
                    fetch('http://localhost:8000/activities/seasons').then(res => res.json()),
                ]);

                setOptions({
                    categories,
                    difficulties,
                    costs,
                    seasons,
                });
            } catch (error) {
                console.error('Error fetching options:', error);
            }
        };

        fetchOptions();
    }, []);

    const getSuggestion = async () => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams();
            if (filters.category) queryParams.append('category', filters.category);
            if (filters.difficulty) queryParams.append('difficulty', filters.difficulty);
            if (filters.cost) queryParams.append('cost', filters.cost);
            if (filters.season) queryParams.append('season', filters.season);

            const response = await fetch(`http://localhost:8000/activities/suggest?${queryParams}`);
            if (!response.ok) {
                throw new Error('Failed to get suggestion');
            }
            const activity = await response.json();
            setSuggestedActivity(activity);
        } catch (error) {
            console.error('Error getting suggestion:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card sx={{ mb: 4 }}>
            <CardContent>
                <Typography variant="h5" gutterBottom>
                    Activity Suggestion
                </Typography>

                <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                        <InputLabel>Category</InputLabel>
                        <Select
                            value={filters.category}
                            label="Category"
                            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                        >
                            <MenuItem value="">Any</MenuItem>
                            {options.categories.map((category) => (
                                <MenuItem key={category} value={category}>
                                    {category.charAt(0).toUpperCase() + category.slice(1)}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl size="small" sx={{ minWidth: 120 }}>
                        <InputLabel>Difficulty</InputLabel>
                        <Select
                            value={filters.difficulty}
                            label="Difficulty"
                            onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
                        >
                            <MenuItem value="">Any</MenuItem>
                            {options.difficulties.map((difficulty) => (
                                <MenuItem key={difficulty} value={difficulty}>
                                    {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl size="small" sx={{ minWidth: 120 }}>
                        <InputLabel>Cost</InputLabel>
                        <Select
                            value={filters.cost}
                            label="Cost"
                            onChange={(e) => setFilters({ ...filters, cost: e.target.value })}
                        >
                            <MenuItem value="">Any</MenuItem>
                            {options.costs.map((cost) => (
                                <MenuItem key={cost} value={cost}>
                                    {cost.charAt(0).toUpperCase() + cost.slice(1)}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl size="small" sx={{ minWidth: 120 }}>
                        <InputLabel>Season</InputLabel>
                        <Select
                            value={filters.season}
                            label="Season"
                            onChange={(e) => setFilters({ ...filters, season: e.target.value })}
                        >
                            <MenuItem value="">Any</MenuItem>
                            {options.seasons.map((season) => (
                                <MenuItem key={season} value={season}>
                                    {season.charAt(0).toUpperCase() + season.slice(1)}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>

                {suggestedActivity ? (
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            {suggestedActivity.title}
                        </Typography>
                        <Typography color="text.secondary" paragraph>
                            {suggestedActivity.description}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                            <Chip label={`Category: ${suggestedActivity.category}`} />
                            <Chip label={`Difficulty: ${suggestedActivity.difficulty}`} />
                            <Chip label={`Cost: ${suggestedActivity.cost}`} />
                            {suggestedActivity.season && (
                                <Chip label={`Season: ${suggestedActivity.season}`} />
                            )}
                            <Chip label={`Duration: ${suggestedActivity.duration} min`} />
                        </Box>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => onAccept(suggestedActivity)}
                            >
                                Let's Do This!
                            </Button>
                            <Button
                                variant="outlined"
                                startIcon={<RefreshIcon />}
                                onClick={getSuggestion}
                                disabled={loading}
                            >
                                Try Another
                            </Button>
                        </Box>
                    </Box>
                ) : (
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Button
                            variant="contained"
                            onClick={getSuggestion}
                            disabled={loading}
                            startIcon={loading ? <CircularProgress size={20} /> : null}
                        >
                            Get Suggestion
                        </Button>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
};

export default ActivitySuggestion;
