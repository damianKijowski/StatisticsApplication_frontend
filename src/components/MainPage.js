import React, { useState } from 'react';
import { Container, Grid } from '@mui/material';
import LeaguesList from './LeaguesList';
import LeagueMatches from './LeagueMatches';
import MatchesList from './MatchesList';
import MatchDetails from './MatchDetails';

const MainPage = () => {
    const [selectedLeague, setSelectedLeague] = useState(null);
    const [selectedMatchId, setSelectedMatchId] = useState(null);

    const handleLeagueSelect = (league) => {
        setSelectedLeague(league);
        setSelectedMatchId(null); // Reset match selection when league changes
    };

    const handleMatchSelect = (matchId) => {
        console.log("Selected Match ID:", matchId);
        setSelectedMatchId(matchId); // Set the selected match ID
    };

    return (
        <Container maxWidth="lg" style={{ padding: '20px', backgroundColor: '#f9f9f9' }}>
            <Grid container spacing={2}>
                {/* Left Panel: LeaguesList */}
                <Grid item xs={3}>
                    <LeaguesList onSelectLeague={handleLeagueSelect} />
                </Grid>

                {/* Middle Panel: MatchesList, LeagueMatches, or MatchDetails */}
                <Grid item xs={9}>
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
    );
};

export default MainPage;
