import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {List, ListItem, ListItemText, ListItemAvatar, Avatar, Paper, CircularProgress} from '@mui/material';

const LeaguesList = ({onSelectLeague}) => {
    const [leagues, setLeagues] = useState([]); // To store league data
    const [loading, setLoading] = useState(true); // To manage loading state
    const [error, setError] = useState(null); // To handle errors

// Fetch league data when component mounts
useEffect(() => {
    const fetchLeagues = async () => {
        try {
            const response = await axios.get('http://localhost:8080/competition'); // Replace with your API endpoint
            console.log(response.data);
            setLeagues(response.data); // Assuming response.data contains an array of leagues
            setLoading(false);
        } catch (err) {
            setError('Failed to load leagues.');
            setLoading(false);
        }
    };

    fetchLeagues();
}, []); // Empty dependency array means this runs once after the component mounts
    if (loading) {
        return (
            <Paper elevation={3} style={{ padding: '20px', height: '100vh' }}>
                <CircularProgress />
            </Paper>
        );
    }

    if (error) {
        return (
            <Paper elevation={3} style={{ padding: '20px', height: '100vh' }}>
                <p>{error}</p>
            </Paper>
        );
    }


return (
    <Paper elevation={3} style={{ padding: '20px', height: '100vh', overflowY: 'auto' }}>
        <List>
            {leagues.map((league, index) => (
                <ListItem button key={index} onClick={() => onSelectLeague(league.code)}>
                    <ListItemAvatar>
                        <Avatar alt={league.name}  src={league.name === "FIFA World Cup" ? league.emblem : league.area.flag}  />
                    </ListItemAvatar>
                    <ListItemText primary={league.name} />
                </ListItem>
            ))}
        </List>
    </Paper>
);

};
export default LeaguesList;