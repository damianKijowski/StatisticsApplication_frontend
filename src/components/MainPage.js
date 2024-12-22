import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Container, Grid } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LeaguesList from './LeaguesList';
import LeagueMatches from './LeagueMatches';
import MatchesList from './MatchesList';
import MatchDetails from './MatchDetails';
import PersonIcon from '@mui/icons-material/Person';

const MainPage = () => {
    const [selectedLeague, setSelectedLeague] = useState(null);
    const [selectedMatchId, setSelectedMatchId] = useState(null);

    const handleLeagueSelect = (league) => {
        setSelectedLeague(league);
        setSelectedMatchId(null); // Reset match selection when league changes
    };

    const handleMatchSelect = (matchId) => {
        console.log('Selected Match ID:', matchId);
        setSelectedMatchId(matchId); // Set the selected match ID
    };

    const handleBack = () => {
        if (selectedMatchId) {
            setSelectedMatchId(null); // Wracamy do widoku ligi
        } else if (selectedLeague) {
            setSelectedLeague(null); // Wracamy do listy lig
        }
    };

    return (
        <div>
            {/* Header */}
            <AppBar position="static" style={{ backgroundColor: '#6583f0' }}>
                <Toolbar>
                    {/* Football Statistics Button */}
                    <IconButton
                        color="inherit"
                        style={{ padding: '0 16px', borderRadius: '4px'}}
                    >
                        <Typography variant="h5" style={{ fontSize: '25px'}}>
                            Football Statistics
                        </Typography>
                    </IconButton>

                    {/* User Icon Button */}
                    <div style={{ flexGrow: 1 }} /> {/* Spacer to push PersonIcon to the right */}
                    <IconButton color="inherit">
                        <PersonIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>

            {/* Main Content */}
            <Container maxWidth="lg" style={{ padding: '20px', backgroundColor: '#f9f9f9' }}>
                <Grid container spacing={2}>
                    {/* Left Panel: LeaguesList */}
                    <Grid item xs={3}>
                        <LeaguesList onSelectLeague={handleLeagueSelect} />
                    </Grid>

                    {/* Middle Panel: MatchesList, LeagueMatches, or MatchDetails */}
                    <Grid item xs={9}>
                        {selectedMatchId || selectedLeague ? (
                            <div style={{ marginBottom: '20px' }}>
                                <IconButton onClick={handleBack} aria-label="back">
                                    <ArrowBackIcon />
                                </IconButton>
                            </div>
                        ) : null}
                        {selectedMatchId ? (
                            // Render MatchDetails when a match is selected
                            <MatchDetails matchId={selectedMatchId} />
                        ) : selectedLeague ? (
                            // Render LeagueMatches when a league is selected
                            <LeagueMatches leagueCode={selectedLeague} />
                        ) : (
                            // Default view: Render MatchesList
                            <MatchesList onSelectedMatch={handleMatchSelect} />
                        )}
                    </Grid>
                </Grid>
            </Container>
        </div>
    );
};

export default MainPage;
