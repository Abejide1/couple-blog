import React, { useState, useEffect } from 'react';
import {
    Card,
    CardContent,
    Typography,
    Button,
    TextField,
    Box,
    Alert,
    Snackbar,
} from '@mui/material';
import { Link as LinkIcon, ContentCopy as CopyIcon } from '@mui/icons-material';

import api from '../utils/axiosConfig'; // Use shared iOS-aware instance

interface CoupleLinkProps {
    onLinkSuccess: () => void;
}

const CoupleLink: React.FC<CoupleLinkProps> = ({ onLinkSuccess }) => {
    const [coupleCode, setCoupleCode] = useState<string | null>(null);
    const [partnerCode, setPartnerCode] = useState('');
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        fetchCoupleCode();
    }, []);

    const fetchCoupleCode = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const response = await api.get('/couple/code', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const code = await response.text();
                setCoupleCode(code);
            }
        } catch (error) {
            console.error('Error fetching couple code:', error);
        }
    };

    const handleCopyCode = () => {
        if (coupleCode) {
            navigator.clipboard.writeText(coupleCode);
            setCopied(true);
        }
    };

    const handleLinkCouple = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const response = await api.post('/couple/link', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ couple_code: partnerCode }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.detail || 'Failed to link couple');
            }

            onLinkSuccess();
        } catch (error: any) {
            setError(error.message);
        }
    };

    return (
        <Card>
            <CardContent>
                <Typography variant="h5" gutterBottom>
                    Link with Your Partner
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" gutterBottom>
                        Your Couple Code:
                    </Typography>
                    <Box display="flex" alignItems="center" gap={1}>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            {coupleCode || 'Loading...'}
                        </Typography>
                        <Button
                            startIcon={<CopyIcon />}
                            onClick={handleCopyCode}
                            disabled={!coupleCode}
                        >
                            Copy
                        </Button>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                        Share this code with your partner to link your accounts
                    </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                        Enter Partner's Code:
                    </Typography>
                    <Box display="flex" gap={1}>
                        <TextField
                            fullWidth
                            placeholder="Enter code"
                            value={partnerCode}
                            onChange={(e) => setPartnerCode(e.target.value)}
                        />
                        <Button
                            variant="contained"
                            startIcon={<LinkIcon />}
                            onClick={handleLinkCouple}
                            disabled={!partnerCode}
                        >
                            Link
                        </Button>
                    </Box>
                </Box>
            </CardContent>

            <Snackbar
                open={copied}
                autoHideDuration={2000}
                onClose={() => setCopied(false)}
                message="Code copied to clipboard"
            />
        </Card>
    );
};

export default CoupleLink;
