import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {
    Typography,
    Box,
    Paper,
    CircularProgress,
    ToggleButtonGroup,
    ToggleButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip, IconButton
} from '@mui/material';
import {Star, StarBorder} from '@mui/icons-material';

const LeagueMatches = ({leagueCode}) => {
    const [matches, setMatches] = useState([]);
    const [standings, setStandings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [view, setView] = useState('schedule'); // 'schedule' or 'standings'
    const [favoriteTeams, setFavoriteTeams] = useState([]);
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        if (!leagueCode) return;

        const fetchMatches = async () => {
            setLoading(true);
            setError(null);

            const today = new Date();
            const tomorrow = new Date();
            tomorrow.setDate(today.getDate() + 1);

            const dateNow = today.toISOString().split('T')[0];
            const dateTomorrow = tomorrow.toISOString().split('T')[0];

            try {
                const response = await axios.get(
                    `http://localhost:8080/matches/${leagueCode}/dateFrom=${dateNow}/dateTo=${dateTomorrow}`
                );
                setMatches(response.data.matches || []);
            } catch (err) {
                setError('Error fetching matches');
            } finally {
                setLoading(false);
            }
        };

        fetchMatches();
    }, [leagueCode]);

    const fetchStandings = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.get(`http://localhost:8080/competition/${leagueCode}/standings`);
            const filteredStandings = response.data.standings.filter(
                (standing) => standing.type === 'TOTAL'
            );
            setStandings(filteredStandings || []);
        } catch (err) {
            setError('Error fetching standings');
        } finally {
            setLoading(false);
        }
    };

    const handleViewChange = async (newView) => {
        setView(newView);

        if (newView === 'standings' && standings.length === 0) {
            await fetchStandings();
        }
    };

    const formatDateTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString();
    };

    const renderForm = (formString) => {
        if (!formString) return null;
        return (
            <Box display="flex" justifyContent="center" alignItems="center">
                {formString.split(',').map((result, index) => {
                    let color;
                    if (result === 'W') color = 'success';
                    else if (result === 'D') color = 'warning';
                    else if (result === 'L') color = 'error';

                    return (
                        <Chip
                            key={index}
                            label={result}
                            size="small"
                            color={color}
                            style={{
                                marginRight: index < formString.length - 1 ? 4 : 0,
                                color: '#fff',
                                width: '30px',
                                height: '30px'
                            }}
                        />
                    );
                })}
            </Box>
        );
    };

    useEffect(() => {
        const fetchFavoriteTeams = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/favTeam/${user.id}`);
                setFavoriteTeams(response.data.map((team) => team.id));
            } catch (error) {
                console.error('Error fetching favorite teams:', error);
            }
        };

        fetchFavoriteTeams();
    }, []);

    const handleFavoriteToggle = async (teamId) => {
        const isFavorite = favoriteTeams.includes(teamId);

        try {
            if (isFavorite) {
                await axios.delete(`http://localhost:8080/favTeam/${user.id}/${teamId}`);
                setFavoriteTeams((prev) => prev.filter((id) => id !== teamId));
            } else {
                // Add to favorites
                await axios.post('http://localhost:8080/favTeam', {
                    teamId,
                    userId: user.id,
                });
                setFavoriteTeams((prev) => [...prev, teamId]);
            }
        } catch (error) {
            console.error('Error updating favorite teams:', error);
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                <CircularProgress/>
            </Box>
        );
    }

    if (error) {
        return (
            <Typography color="error" align="center">
                {error}
            </Typography>
        );
    }

    return (
        <Box padding={3} bgcolor="#f9f9f9">
            <Typography variant="h4" align="center" gutterBottom>
                {view === 'schedule'
                    ? `Matches for ${matches[0]?.competition?.name || 'League'}`
                    : `Standings for ${matches[0]?.competition?.name || 'League'}`}
            </Typography>

            {/* Toggle Buttons for Schedule and Standings */}
            <Box display="flex" justifyContent="center" marginBottom={3}>
                <ToggleButtonGroup
                    value={view}
                    exclusive
                    onChange={(e, newView) => handleViewChange(newView)}
                    aria-label="View toggle"
                >
                    <ToggleButton value="schedule" aria-label="Schedule">
                        Schedule
                    </ToggleButton>
                    <ToggleButton value="standings" aria-label="Standings">
                        Standings
                    </ToggleButton>
                </ToggleButtonGroup>
            </Box>

            {view === 'schedule' ? (
                matches.length === 0 ? (
                    <Typography align="center" color="textSecondary">
                        No matches found.
                    </Typography>
                ) : (
                    matches.map((match) => (
                        <Paper
                            key={match.id}
                            elevation={2}
                            sx={{padding: 2, marginBottom: 2}}
                        >
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                {/* Teams */}
                                <Box display="flex" alignItems="center">
                                    {/* Home Team */}
                                    <Box display="flex" alignItems="center">
                                        <img
                                            src={match.homeTeam.crest}
                                            alt={`${match.homeTeam.name} crest`}
                                            style={{width: '40px', height: '40px', marginRight: '10px'}}
                                        />
                                        <Typography variant="body1">{match.homeTeam.name}</Typography>
                                    </Box>

                                    <Typography variant="body2" color="textSecondary" marginX={2}>
                                        vs
                                    </Typography>

                                    {/* Away Team */}
                                    <Box display="flex" alignItems="center">
                                        <Typography variant="body1">{match.awayTeam.name}</Typography>
                                        <img
                                            src={match.awayTeam.crest}
                                            alt={`${match.awayTeam.name} crest`}
                                            style={{width: '40px', height: '40px', marginLeft: '10px'}}
                                        />
                                    </Box>
                                </Box>

                                {/* Match Details */}
                                <Box textAlign="right">
                                    <Typography variant="body2">
                                        Status: <strong>{match.status}</strong>
                                    </Typography>
                                    {match.status === 'IN_PLAY' && (
                                        <Typography variant="body2" color="green" fontWeight="bold">
                                            {match.score.fullTime.home}:{match.score.fullTime.away} {match.minute}'
                                        </Typography>
                                    )}
                                    {match.status === 'FINISHED' && (
                                        <Typography variant="body2" color="green" fontWeight="bold">
                                            {match.score.fullTime.home}:{match.score.fullTime.away}
                                        </Typography>
                                    )}
                                    <Typography variant="body2" color="textSecondary">
                                        {formatDateTime(match.utcDate)}
                                    </Typography>
                                </Box>
                            </Box>
                        </Paper>
                    ))
                )
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>#</TableCell>
                                <TableCell>Team</TableCell>
                                <TableCell></TableCell>
                                <TableCell align="center">Played</TableCell>
                                <TableCell align="center">Won</TableCell>
                                <TableCell align="center">Draw</TableCell>
                                <TableCell align="center">Lost</TableCell>
                                <TableCell align="center">Points</TableCell>
                                <TableCell align="center">GD</TableCell>
                                <TableCell align="center">Form</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {standings.map((standing) =>
                                standing.table.map((teamData) => (
                                    <TableRow key={teamData.team.id}>
                                        <TableCell>{teamData.position}</TableCell>
                                        <TableCell>
                                            <Box display="flex" alignItems="left">
                                                <img
                                                    src={teamData.team.crest}
                                                    alt={`${teamData.team.name} crest`}
                                                    style={{
                                                        width: '30px',
                                                        height: '30px',
                                                        marginRight: '10px',
                                                    }}
                                                />
                                                {teamData.team.name}
                                            </Box>
                                        </TableCell>
                                        <TableCell size="medium" align={"left"}>
                                            <IconButton
                                                onClick={() => handleFavoriteToggle(teamData.team.id)}
                                                aria-label="Toggle favorite"
                                                >
                                                {favoriteTeams.includes(teamData.team.id) ? (
                                                    <Star style={{color: 'gold'}}/>
                                                ) : (
                                                    <StarBorder/>
                                                )}
                                            </IconButton></TableCell>
                                        <TableCell align="center">{teamData.playedGames}</TableCell>
                                        <TableCell align="center">{teamData.won}</TableCell>
                                        <TableCell align="center">{teamData.draw}</TableCell>
                                        <TableCell align="center">{teamData.lost}</TableCell>
                                        <TableCell align="center">{teamData.points}</TableCell>
                                        <TableCell align="center">{teamData.goalDifference}</TableCell>
                                        <TableCell align="center">{renderForm(teamData.form)}</TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );
};

export default LeagueMatches;
