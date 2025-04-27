import React, { useState } from 'react';
import {
    Container,
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    Alert,
    Divider
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useCouple } from '../contexts/CoupleContext';

const CodeEntry = () => {
    const [code, setCode] = useState('');
    const [newCode, setNewCode] = useState('');
    const { setCode: saveCode } = useCouple();
    const navigate = useNavigate();

    const generateNewCode = () => {
        // Generate a simple 6-character code
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < 6; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setNewCode(result);
    };

    const handleJoin = () => {
        if (code.length === 6) {
            saveCode(code.toUpperCase());
            navigate('/activities');
        }
    };

    const handleCreate = () => {
        if (newCode) {
            saveCode(newCode);
            navigate('/activities');
        } else {
            generateNewCode();
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 8, mb: 4 }}>
                <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 400, mx: 'auto', fontFamily: 'inherit', mt: 8 }}>
                    <Box sx={{
                        bgcolor: '#FFF6FB',
                        borderRadius: '32px',
                        boxShadow: '0 2px 12px #FFD6E8',
                        textAlign: 'center',
                        p: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}>
                        <Typography variant="h4" fontWeight={900} sx={{ color: '#B388FF', mb: 2 }}>Welcome to Couple Activities</Typography>
                        <Typography variant="body1" align="center" color="text.secondary" paragraph>
                            Share activities, books, movies, and memories with your partner
                        </Typography>

                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, mt: 4 }}>
                            <Typography variant="h6" gutterBottom>
                                Join Existing Couple
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                                <TextField
                                    fullWidth
                                    label="Enter Couple Code"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                                    placeholder="ABCD12"
                                    inputProps={{ maxLength: 6 }}
                                />
                                <Button
                                    variant="contained"
                                    onClick={handleJoin}
                                    disabled={code.length !== 6}
                                >
                                    Join
                                </Button>
                            </Box>
                    <Typography variant="h6" gutterBottom>
                        Join Existing Couple
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                        <TextField
                            fullWidth
                            label="Enter Couple Code"
                            value={code}
                            onChange={(e) => setCode(e.target.value.toUpperCase())}
                            placeholder="ABCD12"
                            inputProps={{ maxLength: 6 }}
                        />
                        <Button
                            variant="contained"
                            onClick={handleJoin}
                            disabled={code.length !== 6}
                        >
                            Join
                        </Button>
                    </Box>

                    <Divider sx={{ my: 3 }}>OR</Divider>

                    <Typography variant="h6" gutterBottom>
                        Create New Couple
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <TextField
                            fullWidth
                            label="Your Couple Code"
                            value={newCode}
                            InputProps={{ readOnly: true }}
                            placeholder="Click Generate"
                        />
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={handleCreate}
                        >
                            {newCode ? 'Use Code' : 'Generate'}
                        </Button>
                    </Box>
                    {newCode && (
                        <Alert severity="info" sx={{ mt: 2 }}>
                            Share this code with your partner so they can join using the same code!
                        </Alert>
                    )}
                </Box>
            </Box>
        </Box>
    );
};

export default CodeEntry;
