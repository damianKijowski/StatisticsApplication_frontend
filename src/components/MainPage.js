import React, { useState } from 'react';
import { Container, Grid } from '@mui/material';
import LeaguesList from './LeaguesList';
import MatchesList from './MatchesList';

const MainPage = () => {
    const [selectedLeague, setSelectedLeague] = useState(null);

    const handleLeagueSelect = (league) => {
        setSelectedLeague(league);
    };

    return (
        <Container maxWidth="lg">
            <Grid container spacing={2}>
                <Grid item xs={3}>
                    <LeaguesList onSelectLeague={handleLeagueSelect} />
                </Grid>
                <Grid item xs={9}>
                    <MatchesList league={selectedLeague} />
                </Grid>
            </Grid>
        </Container>
    );
};

export default MainPage;