import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Container, Grid } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonIcon from '@mui/icons-material/Person';
import LeaguesList from './LeaguesList';
import LeagueMatches from './LeagueMatches';
import MatchesList from './MatchesList';
import MatchDetails from './MatchDetails';
import FavoriteTeams from './FavoriteTeams';
import TeamMatches from './TeamMatches';

const MainPage = ({ loggedInUser }) => {
    const [selectedLeague, setSelectedLeague] = useState(null);
    const [selectedMatchId, setSelectedMatchId] = useState(null);
    const [showFavoriteTeams, setShowFavoriteTeams] = useState(false);
    const [selectedTeamId, setSelectedTeamId] = useState(null);
    const [favoriteTeams, setFavoriteTeams] = useState([]);

    const handleLeagueSelect = (league) => {
        setSelectedLeague(league);
        setSelectedMatchId(null);
        setSelectedTeamId(null);
    };

    const handleMatchSelect = (matchId) => {
        setSelectedMatchId(matchId);
        setSelectedLeague(null);
        setSelectedTeamId(null);
    };

    const handleBack = () => {
        if (selectedMatchId) {
            setSelectedMatchId(null);
        } else if (selectedLeague) {
            setSelectedLeague(null);
        } else if (selectedTeamId) {
            setSelectedTeamId(null);
        }
    };

    const toggleFavoriteTeams = () => {
        setShowFavoriteTeams(!showFavoriteTeams);
    };

    const handleTeamClick = (teamId) => {
        setSelectedTeamId(teamId);
        setSelectedLeague(null);
        setSelectedMatchId(null);
    };

    return (
        <div>
            <AppBar position="static" style={{ backgroundColor: '#6583f0' }}>
                <Toolbar>
                    <IconButton color="inherit" style={{ padding: '0 16px', borderRadius: '4px' }}>
                        <Typography variant="h5" style={{ fontSize: '25px' }}>
                            Football Statistics
                        </Typography>
                    </IconButton>
                    <div style={{ flexGrow: 1 }} />
                    <IconButton color="inherit" onClick={toggleFavoriteTeams}>
                        <Typography variant="body2" sx={{ marginRight: '5px' }} />
                        <PersonIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>

            <Container maxWidth="xl" style={{ padding: '20px', backgroundColor: '#f9f9f9' }}>
                <Grid container spacing={2}>
                    <Grid item xs={2.5}>
                        <LeaguesList onSelectLeague={handleLeagueSelect} />
                    </Grid>

                    <Grid item xs={7.5}>
                        {selectedMatchId || selectedLeague || selectedTeamId ? (
                            <div style={{ marginBottom: '20px' }}>
                                <IconButton onClick={handleBack} aria-label="back">
                                    <ArrowBackIcon />
                                </IconButton>
                            </div>
                        ) : null}
                        {selectedMatchId ? (
                            <MatchDetails matchId={selectedMatchId} loggedInUser={loggedInUser} />
                        ) : selectedLeague ? (
                            <LeagueMatches leagueCode={selectedLeague} />
                        ) : selectedTeamId ? (
                            <TeamMatches teamId={selectedTeamId} />
                        ) : (
                            <MatchesList onSelectedMatch={handleMatchSelect} loggedInUser={loggedInUser} />
                        )}
                    </Grid>

                    <Grid item xs={2}>
                        <FavoriteTeams favoriteTeams={favoriteTeams} onTeamClick={handleTeamClick} />
                    </Grid>
                </Grid>
            </Container>
        </div>
    );
};

export default MainPage;
