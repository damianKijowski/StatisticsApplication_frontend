import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {
    Paper,
    CircularProgress,
    List,
    ListItem,
    ListItemAvatar,
    Avatar,
    Divider,
    Typography, Box
} from '@mui/material';


const MatchesList = () => {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    useEffect(() => {
        const fetchMatches = async () => {
            try {
                 const leagues = ['BSA', 'ELC', 'PL', 'CL', 'EC', 'FL1', 'BL1', 'SA', 'DED', 'PPL', 'CLI', 'PD', 'WC'];
                // const leagues = ['BL1', "PL"];
                const date = new Date().toISOString().split('T')[0];
                // Fetch matches for each league dynamically
                const leagueMatches = await Promise.all(
                    leagues.map(async (league) => {
                        // Get today's date in YYYY-MM-DD format inline
                        const url = `http://localhost:8080/matches/${league}/dateFrom=${date}/dateTo=${date}`;
                        console.log("URL: " + url);
                        const response = await axios.get(url);

                        return {
                            leagueName: league,  // Store the league abbreviation (e.g., PL, BSA, etc.)
                            matches: response.data.matches || [], // Matches for this league
                        };
                    })
                );

                // Filter out leagues with no matches for today
                const filteredMatches = leagueMatches.filter(league => league.matches.length > 0);

                setMatches(filteredMatches);
                setLoading(false);
            } catch (err) {
                setError('Failed to load matches.');
                setLoading(false);
            }
        };

        fetchMatches();
    }, []);

    if (loading) {
        return (
            <Paper style={{padding: '20px', textAlign: 'center'}}>
                <CircularProgress/>
            </Paper>
        );
    }

    if (error) {
        return (
            <Paper style={{padding: '20px', textAlign: 'center'}}>
                <Typography variant="h6">{error}</Typography>
            </Paper>
        );
    }

    return (
        <div>
            {matches.map((leagueMatches, index) => (
                <div key={index} style={{marginBottom: '20px'}}>
                    <Typography variant="h6" style={{marginBottom: '10px', fontWeight: 'bold'}}>
                        {leagueMatches.leagueName} <span style={{color: 'blue'}}>⚽</span>
                    </Typography>
                    <Paper elevation={3} style={{padding: '10px'}}>
                        <List>
                            {leagueMatches.matches.map((match, matchIndex) => (
                                <div key={matchIndex}>
                                    <ListItem>

                                        <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                                            <ListItemAvatar>
                                                <Avatar alt={match.homeTeam.name} src={match.homeTeam.crest}/>
                                            </ListItemAvatar>
                                            <Typography variant="body1">{match.homeTeam.name}</Typography>
                                        </Box>


                                        <Typography sx={{margin: '0 8px'}} variant="body1">
                                            vs
                                        </Typography>


                                        <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                                            <Typography variant="body1">{match.awayTeam.name}</Typography>
                                            <ListItemAvatar>
                                                <Avatar alt={match.awayTeam.name} src={match.awayTeam.crest}/>
                                            </ListItemAvatar>
                                        </Box>
                                        <Box sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'flex-end', // Push content to the bottom of this box
                                            position: 'absolute',
                                            right: 0, // Align to the far-right edge
                                            top: 0,
                                            bottom: 0, // Stretch vertically
                                        }}>
                                            <Typography variant="body1" sx={{textAlign: 'right'}}>
                                                {match.score.fullTime.home} - {match.score.fullTime.away}
                                            </Typography>
                                            <Typography variant="body2" color="textSecondary" sx={{textAlign: 'right'}}>
                                                Status: {match.status}
                                            </Typography>
                                        </Box>
                                    </ListItem>
                                    <Divider/>
                                    <Divider/>
                                </div>
                            ))}
                        </List>
                    </Paper>
                </div>
            ))}
        </div>
    );
};

export default MatchesList;