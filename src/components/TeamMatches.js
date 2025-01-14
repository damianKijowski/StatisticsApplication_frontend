import React, { useState, useEffect } from 'react';
import { Typography, Card, CardContent, Grid, CardMedia, CircularProgress, Box, Divider } from '@mui/material';
import axios from 'axios';

const TeamMatches = ({ teamId }) => {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [teamName, setTeamName] = useState(''); // State to hold the team name

    useEffect(() => {
        const fetchMatches = async () => {
            const dateNow = new Date().toISOString().split('T')[0]; // Get today's date
            const dateTo = new Date(new Date().setDate(new Date().getDate() + 14)).toISOString().split('T')[0]; // 14 days later

            try {
                const response = await axios.get(
                    `http://localhost:8080/team/matches/${teamId}/dateFrom=${dateNow}/dateTo=${dateTo}`
                );
                console.log('RESPONSE: ', response.data);
                const fetchedMatches = response.data.matches || [];
                setMatches(fetchedMatches);

                // Extract the team name from the first match if available
                if (fetchedMatches.length > 0) {
                    const firstMatch = fetchedMatches[0];
                    if (firstMatch.homeTeam.id === teamId) {
                        setTeamName(firstMatch.homeTeam.name);
                    } else if (firstMatch.awayTeam.id === teamId) {
                        setTeamName(firstMatch.awayTeam.name);
                    }
                }
            } catch (err) {
                setError('Error fetching matches');
            } finally {
                setLoading(false);
            }
        };

        fetchMatches();
    }, [teamId]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Typography sx={{ color: 'error.main', textAlign: 'center', marginTop: 3 }}>{error}</Typography>
        );
    }

    return (
        <Box sx={{ padding: 3 }}>
            <Typography
                variant="h5"
                sx={{
                    marginBottom: 3,
                    fontWeight: 'bold',
                    textAlign: 'center'
                }}
            >
                {teamName ? `${teamName}'s Schedule` : 'Team Schedule'}
            </Typography>
            {matches.map((match) => (
                <Card
                    key={match.id}
                    sx={{
                        marginBottom: 2,
                        padding: 2,
                        backgroundColor: '#f9f9f9',
                        boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
                        borderRadius: '10px',
                    }}
                >
                    <CardContent>
                        {/* Status */}
                        <Typography
                            variant="subtitle1"
                            sx={{
                                textAlign: 'center',
                                color: match.status === 'TIMED' ? 'success.main' : 'error.main',
                                fontWeight: 'bold',
                                marginBottom: 2,
                            }}
                        >
                            Status: {match.status}
                        </Typography>

                        {/* Teams Grid */}
                        <Grid container spacing={2} alignItems="center">
                            {/* Home Team */}
                            <Grid item xs={5} sx={{ textAlign: 'center' }}>
                                <CardMedia
                                    component="img"
                                    image={match.homeTeam.crest}
                                    alt={match.homeTeam.name}
                                    sx={{
                                        width: 60,
                                        height: 60,
                                        margin: '0 auto',
                                        border: '1px solid #ddd',
                                        borderRadius: '50%',
                                    }}
                                />
                                <Typography variant="body1" sx={{ fontWeight: 'bold', marginTop: 1 }}>
                                    {match.homeTeam.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    ({match.homeTeam.tla})
                                </Typography>
                            </Grid>

                            {/* VS */}
                            <Grid item xs={2} sx={{ textAlign: 'center' }}>
                                <Typography
                                    variant="h6"
                                    sx={{ fontWeight: 'bold', color: 'text.secondary' }}
                                >
                                    VS
                                </Typography>
                            </Grid>

                            {/* Away Team */}
                            <Grid item xs={5} sx={{ textAlign: 'center' }}>
                                <CardMedia
                                    component="img"
                                    image={match.awayTeam.crest}
                                    alt={match.awayTeam.name}
                                    sx={{
                                        width: 60,
                                        height: 60,
                                        margin: '0 auto',
                                        border: '1px solid #ddd',
                                        borderRadius: '50%',
                                    }}
                                />
                                <Typography variant="body1" sx={{ fontWeight: 'bold', marginTop: 1 }}>
                                    {match.awayTeam.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    ({match.awayTeam.tla})
                                </Typography>
                            </Grid>
                        </Grid>

                        <Divider sx={{ marginY: 2 }} />

                        {/* Competition and Date */}
                        <Typography variant="body2" sx={{ marginBottom: 1, color: 'text.primary' }}>
                            <strong>Competition:</strong> {match.competition.name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.primary' }}>
                            <strong>Date:</strong> {new Date(match.utcDate).toLocaleString()}
                        </Typography>
                    </CardContent>
                </Card>
            ))}
        </Box>
    );
};

export default TeamMatches;
